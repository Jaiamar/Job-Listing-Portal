const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  jobType: {
    type: String,
    required: true,
    enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote']
  },
  department: { type: String, trim: true },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  salaryRange: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [50, 'Description must be at least 50 characters']
  },
  qualifications: [String],
  responsibilities: [String],
  tags: [String],
  deadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },
  status: {
    type: String,
    enum: ['Draft', 'Active', 'Paused', 'Closed'],
    default: 'Draft'
  },
  viewsCount: { type: Number, default: 0 }
}, { timestamps: true });

// Text index for search
jobSchema.index({ title: 'text', description: 'text', tags: 'text', location: 'text' });
jobSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);
