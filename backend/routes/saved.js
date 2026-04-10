const express = require('express');
const router = express.Router();
const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');
const EmployerProfile = require('../models/EmployerProfile');
const { protect, authorize } = require('../middleware/auth');

// POST /api/saved/:jobId
router.post('/:jobId', protect, authorize('seeker'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const saved = await SavedJob.create({ userId: req.user._id, jobId: req.params.jobId });
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Job already saved' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/saved/:jobId
router.delete('/:jobId', protect, authorize('seeker'), async (req, res) => {
  try {
    await SavedJob.findOneAndDelete({ userId: req.user._id, jobId: req.params.jobId });
    res.json({ success: true, message: 'Job removed from saved' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/saved
router.get('/', protect, authorize('seeker'), async (req, res) => {
  try {
    const saved = await SavedJob.find({ userId: req.user._id })
      .populate('jobId')
      .sort({ createdAt: -1 });

    const enriched = await Promise.all(saved.map(async (s) => {
      if (!s.jobId) return null;
      const employer = await EmployerProfile.findOne({ userId: s.jobId.employerId });
      return { ...s.toObject(), employer: employer || {} };
    }));

    res.json({ success: true, data: enriched.filter(Boolean) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
