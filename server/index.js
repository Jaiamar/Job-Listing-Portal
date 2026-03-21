/**
 * Complete Node.js/Express Backend JWT Authentication Guide & Implementation
 * 
 * Prerequisites:
 * npm install express mongoose bcryptjs jsonwebtoken cors dotenv express-rate-limit helmet
 */

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

// --- Configuration Setup (Normally in .env) ---
const config = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/auth-db',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'super-refresh-secret-key',
  JWT_EXPIRES_IN: '15m', // Short life for access token
  JWT_REFRESH_EXPIRES_IN: '7d', // Longer life for refresh token
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_TIME: 15 * 60 * 1000 // 15 minutes in ms
};

// --- Mongoose User Schema ---
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['job_seeker', 'employer', 'admin'],
    required: true
  },
  // Security fields for account lockout
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: {
    type: Number
  },
  // Refresh Token tracking (optional: can store in separate collection for multiple devices)
  refreshToken: String,
}, { timestamps: true });

// Virtual to check if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save hook to hash password
userSchema.pre('save', async function() {
  const user = this;
  
  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return;

  const salt = await bcrypt.genSalt(10); // 10 rounds is standard
  user.password = await bcrypt.hash(user.password, salt);
});

// Method to verify password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  return this.save();
};

const User = mongoose.model('User', userSchema);

// --- Profile Schemas (LinkedIn-style) ---

const jobSeekerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  headline: { type: String, trim: true, default: 'New to the network' },
  about: { type: String, trim: true, default: '' },
  experience: [{
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: String,
    startDate: Date,
    endDate: Date, // null if current
    current: { type: Boolean, default: false },
    description: String
  }],
  education: [{
    school: { type: String, required: true },
    degree: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date
  }],
  skills: [String],
  resumeUrl: String, // URL or path
  contactEmail: String,
  contactPhone: String,
  location: String,
});

const employerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName: { type: String, required: true, trim: true },
  tagline: { type: String, trim: true, default: '' },
  industry: String,
  companySize: String, // e.g. "1-10", "11-50", "51-200"
  logoUrl: String,
  bannerUrl: String,
  aboutUs: { type: String, trim: true, default: '' },
  website: String,
  contactEmail: String,
  contactPhone: String,
  headquarters: String,
});

const JobSeekerProfile = mongoose.model('JobSeekerProfile', jobSeekerProfileSchema);
const EmployerProfile = mongoose.model('EmployerProfile', employerProfileSchema);

// --- Application Setup ---
const app = express();

// Security Middleware
app.use(helmet()); // Sets generic security HTTP headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true // allow cookies for refresh tokens
}));
app.use(express.json({ limit: '10kb' })); // Body parser, limit payload size

// Rate limiting to prevent brute force attacks on the whole API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', apiLimiter);

// Specific stricter limit for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 20, // start blocking after 20 requests
  message: 'Too many accounts created or auth attempts from this IP, please try again after an hour'
});


// --- Authentication Utility Functions ---
const generateTokens = (user) => {
  // Access Token: Short-lived, contains user claims
  const accessToken = jwt.sign(
    { 
      sub: user._id, 
      role: user.role,
      name: user.name,
      // Add more standard/custom claims here if needed
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );

  // Refresh Token: Long-lived, only contains critical identifier
  const refreshToken = jwt.sign(
    { sub: user._id },
    config.JWT_REFRESH_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};


// --- Default Route ---
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Job Listing Portal Auth API!' });
});

// --- API Routes ---

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 */
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    // Basic Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required (name, email, password, role)' });
    }

    if (!['job_seeker', 'employer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Password strength check (can be expanded)
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already in use' });
    }

    // Create user
    const newUser = new User({ name, email, password, role });
    await newUser.save();

    // Create related profile
    if (role === 'job_seeker') {
      await JobSeekerProfile.create({ userId: newUser._id, contactEmail: email });
    } else if (role === 'employer') {
      await EmployerProfile.create({ userId: newUser._id, companyName: name, contactEmail: email });
    }

    // Optionally auto-login after register
    const { accessToken, refreshToken } = generateTokens(newUser);
    
    // Save refresh token to user (if tracking in DB)
    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
      accessToken,
      refreshToken
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Authenticate user & get token
 */
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user and select password (which was excluded by default if setup in schema)
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check for Account Lockout
    if (user.isLocked) {
      const lockTimeRemaining = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
      return res.status(403).json({ 
        message: `Account is temporarily locked due to multiple failed login attempts. Try again in ${lockTimeRemaining} minutes.` 
      });
    }

    // Verify Password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      // Handle failed attempt
      user.loginAttempts += 1;
      
      // If reached max attempts, lock the account
      if (user.loginAttempts >= config.MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = Date.now() + config.LOCKOUT_TIME;
      }
      
      await user.save();

      return res.status(401).json({ 
        message: 'Invalid credentials',
        attemptsLeft: Math.max(0, config.MAX_LOGIN_ATTEMPTS - user.loginAttempts)
      });
    }

    // Successful login -> Reset attempts
    await user.resetLoginAttempts();

    // Generate Tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token to DB (Allows revoking eventually)
    user.refreshToken = refreshToken;
    await user.save();

    // Ideal practice: Send refresh token in a secure HttpOnly cookie
    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    // });

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken, // Returning in payload for mobile/non-cookie clients
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route POST /api/auth/refresh
 * @desc Get new access token using refresh token
 */
app.post('/api/auth/refresh', async (req, res) => {
  try {
    // Look for token in body, or alternatively in cookies (req.cookies.refreshToken)
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
    
    // Find user to ensure they still exist and token hasn't been revoked
    const user = await User.findById(decoded.sub);
    
    // Check if token matches the stored one (prevents reused/stolen token attacks)
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token. Please login again.' });
    }

    // Generate new tokens
    const tokens = generateTokens(user);
    
    // Optional: Implement "Refresh Token Rotation" by invalidating old one and saving new one
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.status(200).json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });

  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
});


// --- Protected Route Middleware ---

/**
 * Middleware to verify JWT token and attach user to request object
 */
const requireAuth = async (req, res, next) => {
  let token;

  // 1. Ensure authorization header exists and starts with Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Extract token
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized to access this route. No token provided.' });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // 3. Check if user still exists
    const currentUser = await User.findById(decoded.sub).select('-password');
    if (!currentUser) {
      return res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
    }

    // 4. (Optional) Check if user changed password after the token was issued
    // This requires adding an \`iat\` check against a \`passwordChangedAt\` field

    // 5. Grant access to protected route
    req.user = currentUser;
    next();
  } catch (err) {
    // Distinguish between expired vs invalid tokens
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

/**
 * Middleware for Role-Based Access Control (RBAC)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// --- Protected Route Examples ---

app.get('/api/users/profile', requireAuth, (req, res) => {
  res.status(200).json({
    message: 'Profile data retrieved securely',
    data: req.user
  });
});

/**
 * @route GET /api/profiles/me
 * @desc Get the detailed profile (Job Seeker or Employer) for the logged-in user
 */
app.get('/api/profiles/me', requireAuth, async (req, res) => {
  try {
    let profile = null;
    if (req.user.role === 'job_seeker') {
      profile = await JobSeekerProfile.findOne({ userId: req.user._id });
    } else if (req.user.role === 'employer') {
      profile = await EmployerProfile.findOne({ userId: req.user._id });
    }

    if (!profile) {
      return res.status(404).json({ message: 'Detailed profile not found' });
    }

    res.status(200).json({ profile, user: req.user });
  } catch (err) {
    res.status(500).json({ message: 'Server error retrieving profile', error: err.message });
  }
});

/**
 * @route PUT /api/profiles/job-seeker
 * @desc Update the detailed Job Seeker profile
 */
app.put('/api/profiles/job-seeker', requireAuth, authorize('job_seeker'), async (req, res) => {
  try {
    const updatedProfile = await JobSeekerProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
});

/**
 * @route PUT /api/profiles/employer
 * @desc Update the detailed Employer profile
 */
app.put('/api/profiles/employer', requireAuth, authorize('employer'), async (req, res) => {
  try {
    const updatedProfile = await EmployerProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: 'Company profile updated successfully', profile: updatedProfile });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update company profile', error: err.message });
  }
});

app.get('/api/admin/dashboard', requireAuth, authorize('admin'), (req, res) => {
  res.status(200).json({
    message: 'Welcome to the admin dashboard!'
  });
});

app.get('/api/admin/users', requireAuth, authorize('admin'), async (req, res) => {
  try {
    // Return all users except passwords, sorted newest first
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});


// --- Server Start ---
// Uncomment to run locally when creating DB
/*
mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(config.PORT, () => console.log(`Server running on port ${config.PORT}`));
  })
  .catch(err => console.error('Database connection error:', err));
*/

module.exports = { app, User, requireAuth, authorize };

// --- Seed Default Admin ---
const seedDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@admin.com' });
    if (!adminExists) {
      const newAdmin = new User({
        name: 'System Admin',
        email: 'admin@admin.com',
        password: 'adminpassword', // Will be hashed automatically by pre-save hook
        role: 'admin'
      });
      await newAdmin.save();
      console.log('✅ Default Admin created: admin@admin.com | Password: adminpassword');
    }
  } catch (err) {
    console.error('Failed to seed default admin:', err.message);
  }
};

mongoose.connect(config.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    seedDefaultAdmin();
  })
  .catch(err => console.error('Database connection warning (Server still running):', err.message));

app.listen(config.PORT, () => console.log(`Server running on port ${config.PORT}`));
