const express = require('express');
const router = express.Router();
const SeekerProfile = require('../models/SeekerProfile');
const EmployerProfile = require('../models/EmployerProfile');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Helper to compute profile completion
const computeSeekerCompletion = (profile) => {
  const fields = ['bio', 'phone', 'skills', 'education', 'experience', 'resumeUrl', 'profilePhoto'];
  let filled = 0;
  fields.forEach(f => {
    const val = profile[f];
    if (Array.isArray(val) ? val.length > 0 : !!val) filled++;
  });
  return Math.round((filled / fields.length) * 100);
};

// ── SEEKER ROUTES ──

// GET /api/profiles/seeker
router.get('/seeker', protect, authorize('seeker', 'admin'), async (req, res) => {
  try {
    const profile = await SeekerProfile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/profiles/seeker
router.put('/seeker', protect, authorize('seeker'), async (req, res) => {
  try {
    const allowed = ['title', 'bio', 'phone', 'address', 'skills', 'education', 'experience', 'linkedin', 'portfolio', 'availability'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    let profile = await SeekerProfile.findOneAndUpdate(
      { userId: req.user._id },
      updates,
      { new: true, upsert: true, runValidators: true }
    );
    profile.profileCompletePct = computeSeekerCompletion(profile);
    await profile.save();

    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/profiles/seeker/resume
router.post('/seeker/resume', protect, authorize('seeker'), upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    const profile = await SeekerProfile.findOneAndUpdate(
      { userId: req.user._id },
      { resumeUrl },
      { new: true, upsert: true }
    );
    res.json({ success: true, resumeUrl, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/profiles/seeker/photo
router.post('/seeker/photo', protect, authorize('seeker'), upload.single('profilePhoto'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const profilePhoto = `/uploads/images/${req.file.filename}`;
    const profile = await SeekerProfile.findOneAndUpdate(
      { userId: req.user._id },
      { profilePhoto },
      { new: true, upsert: true }
    );
    res.json({ success: true, profilePhoto, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── EMPLOYER ROUTES ──

// GET /api/profiles/employer
router.get('/employer', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const profile = await EmployerProfile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/profiles/employer/:userId (public employer info for job detail page)
router.get('/employer/:userId', async (req, res) => {
  try {
    const profile = await EmployerProfile.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/profiles/employer
router.put('/employer', protect, authorize('employer'), async (req, res) => {
  try {
    const allowed = ['companyName', 'industry', 'companySize', 'description', 'website', 'linkedin', 'twitter', 'location', 'registrationNo'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const profile = await EmployerProfile.findOneAndUpdate(
      { userId: req.user._id },
      updates,
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/profiles/employer/logo
router.post('/employer/logo', protect, authorize('employer'), upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const logoUrl = `/uploads/images/${req.file.filename}`;
    const profile = await EmployerProfile.findOneAndUpdate(
      { userId: req.user._id },
      { logoUrl },
      { new: true, upsert: true }
    );
    res.json({ success: true, logoUrl, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
