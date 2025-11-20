const express = require('express');
const router = express.Router();
const College = require('../models/College');
const { protect } = require('../middleware/authMiddleware');

// Middleware to check for Super Admin
const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as Super Admin' });
  }
};

// Get college by slug (Public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const college = await College.findOne({ slug: req.params.slug });
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    res.json(college);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all colleges (Public for signup, or protected?)
// Let's make it protected for now, or public for the dropdown later.
// For Super Admin dashboard, we definitely need it.
router.get('/', async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new college (Super Admin only)
router.post('/', protect, superAdminOnly, async (req, res) => {
  const { name, slug, domain, address } = req.body;

  try {
    const college = new College({
      name,
      slug,
      domain,
      address
    });

    const createdCollege = await college.save();
    res.status(201).json(createdCollege);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Slug or Domain already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
