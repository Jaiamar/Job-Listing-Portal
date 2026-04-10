const mongoose = require('mongoose');

const employerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  industry: { type: String, trim: true },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+']
  },
  description: String,
  website: String,
  logoUrl: String,
  registrationNo: String,
  linkedin: String,
  twitter: String,
  isVerified: { type: Boolean, default: false },
  location: String
}, { timestamps: true });

module.exports = mongoose.model('EmployerProfile', employerProfileSchema);
