const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const EmployerProfile = require('../models/EmployerProfile');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/jobs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { keyword, location, jobType, salaryMin, salaryMax, datePosted, sort, page = 1, limit = 12, status } = req.query;

    const query = {};

    // Default to active jobs for public; admin can see all
    query.status = status || 'Active';

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(keyword, 'i')] } },
        { location: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (salaryMin) {
      query['salaryRange.min'] = { $gte: parseInt(salaryMin) };
    }
    if (salaryMax) {
      query['salaryRange.max'] = { $lte: parseInt(salaryMax) };
    }

    if (datePosted) {
      const now = new Date();
      const daysMap = { '24h': 1, '7d': 7, '30d': 30 };
      const days = daysMap[datePosted];
      if (days) {
        query.createdAt = { $gte: new Date(now - days * 24 * 60 * 60 * 1000) };
      }
    }

    const sortMap = {
      'newest': { createdAt: -1 },
      'salary-high': { 'salaryRange.max': -1 },
      'salary-low': { 'salaryRange.min': 1 },
      'company': { title: 1 }
    };
    const sortOption = sortMap[sort] || { createdAt: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('employerId', 'name email')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    // Attach employer profiles
    const jobsWithEmployer = await Promise.all(jobs.map(async (job) => {
      const empProfile = await EmployerProfile.findOne({ userId: job.employerId._id });
      return {
        ...job.toObject(),
        employer: empProfile || {}
      };
    }));

    res.json({
      success: true,
      data: jobsWithEmployer,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/jobs/employer/mine
// @access  Private (Employer)
router.get('/employer/mine', protect, authorize('employer'), async (req, res) => {
  try {
    const { status } = req.query;
    const query = { employerId: req.user._id };
    if (status) query.status = status;

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/jobs/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employerId', 'name email');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    // Increment view count
    job.viewsCount = (job.viewsCount || 0) + 1;
    await job.save({ validateBeforeSave: false });

    const employer = await EmployerProfile.findOne({ userId: job.employerId._id });
    res.json({ success: true, data: { ...job.toObject(), employer: employer || {} } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/jobs
// @access  Private (Employer)
router.post('/', protect, authorize('employer'), async (req, res) => {
  try {
    const { title, jobType, department, location, salaryRange, description, qualifications, responsibilities, tags, deadline, status } = req.body;
    const job = await Job.create({
      employerId: req.user._id,
      title, jobType, department, location, salaryRange,
      description, qualifications, responsibilities, tags,
      deadline, status: status || 'Draft'
    });
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/jobs/:id
// @access  Private (Employer)
router.put('/:id', protect, authorize('employer'), async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    if (job.status === 'Closed') {
      return res.status(400).json({ success: false, message: 'Closed jobs cannot be edited' });
    }

    const allowed = ['title', 'jobType', 'department', 'location', 'salaryRange', 'description', 'qualifications', 'responsibilities', 'tags', 'deadline', 'status'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    job = await Job.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/jobs/:id
// @access  Private (Employer)
router.delete('/:id', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.employerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await job.deleteOne();
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
