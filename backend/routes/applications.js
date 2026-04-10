const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const SeekerProfile = require('../models/SeekerProfile');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/applications
// @access  Private (Seeker)
router.post('/', protect, authorize('seeker'), async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job || job.status !== 'Active') {
      return res.status(400).json({ success: false, message: 'Job is not available for applications' });
    }

    const existing = await Application.findOne({ jobId, seekerId: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    const profile = await SeekerProfile.findOne({ userId: req.user._id });
    if (!profile?.resumeUrl) {
      return res.status(400).json({ success: false, message: 'Please upload a resume before applying' });
    }

    const application = await Application.create({
      jobId,
      seekerId: req.user._id,
      resumeUrl: profile.resumeUrl,
      coverLetter
    });

    // Notify employer
    await Notification.create({
      userId: job.employerId,
      type: 'APPLICATION_RECEIVED',
      message: `New application received for "${job.title}"`,
      referenceId: application._id.toString()
    });

    // Notify seeker
    await Notification.create({
      userId: req.user._id,
      type: 'STATUS_CHANGED',
      message: `Your application for "${job.title}" was submitted successfully`,
      referenceId: application._id.toString()
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/applications/seeker
// @access  Private (Seeker)
router.get('/seeker', protect, authorize('seeker'), async (req, res) => {
  try {
    const applications = await Application.find({ seekerId: req.user._id })
      .populate({ path: 'jobId', populate: { path: 'employerId', select: 'name email' } })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
router.get('/job/:jobId', protect, authorize('employer'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('seekerId', 'name email phone')
      .sort({ createdAt: -1 });

    // Attach seeker profile
    const enriched = await Promise.all(applications.map(async (app) => {
      const profile = await SeekerProfile.findOne({ userId: app.seekerId._id });
      return { ...app.toObject(), seekerProfile: profile || {} };
    }));

    res.json({ success: true, data: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/applications/:id
// @access  Private (Employer) — update status
router.put('/:id', protect, authorize('employer'), async (req, res) => {
  try {
    const { status, employerNotes } = req.body;
    const application = await Application.findById(req.params.id).populate('jobId');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    if (application.jobId.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = status || application.status;
    if (employerNotes !== undefined) application.employerNotes = employerNotes;
    await application.save();

    // Notify seeker
    await Notification.create({
      userId: application.seekerId,
      type: 'STATUS_CHANGED',
      message: `Your application for "${application.jobId.title}" status updated to: ${application.status}`,
      referenceId: application._id.toString()
    });

    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/applications/:id/withdraw
// @access  Private (Seeker)
router.put('/:id/withdraw', protect, authorize('seeker'), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    if (application.seekerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    application.status = 'Withdrawn';
    await application.save();
    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
