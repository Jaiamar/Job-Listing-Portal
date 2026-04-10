const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  field: String,
  startYear: Number,
  endYear: Number
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  company: String,
  title: String,
  location: String,
  startDate: String,
  endDate: String,
  current: { type: Boolean, default: false },
  description: String
}, { _id: false });

const seekerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  title: String,
  bio: { type: String, maxlength: [2000, 'Bio cannot exceed 2000 characters'] },
  phone: String,
  address: String,
  skills: [String],
  education: [educationSchema],
  experience: [experienceSchema],
  resumeUrl: String,
  profilePhoto: String,
  linkedin: String,
  portfolio: String,
  availability: {
    type: String,
    enum: ['Immediate', '2 Weeks', '1 Month', 'Not Available'],
    default: 'Immediate'
  },
  profileCompletePct: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('SeekerProfile', seekerProfileSchema);
