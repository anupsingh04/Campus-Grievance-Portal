const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const College = require('../models/College');

// Register User
router.post('/register', async (req, res) => {
  const { name, email, password, collegeId } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate College
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(400).json({ message: 'Invalid College' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'student', // Default to student
      collegeId
    });

    await user.save();

    // Return Token
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      collegeId: user.collegeId,
      collegeName: college.name,
      token: generateToken(user._id, user.role)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    // SEEDING (Updated with College)
    const count = await User.countDocuments();
    if (count === 0) {
      // Create Default College
      const college = await College.create({
        name: 'Demo University',
        domain: 'campus.edu',
        address: '123 Education Lane'
      });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password', salt);
      const hashedAdmin = await bcrypt.hash('admin', salt);
      
      await User.create([
        { name: 'Student User', email: 'student@campus.edu', password: hashedPassword, role: 'student', collegeId: college._id },
        { name: 'Admin User', email: 'admin@campus.edu', password: hashedAdmin, role: 'admin', collegeId: college._id },
        { name: 'Another Student', email: 'student2@campus.edu', password: hashedPassword, role: 'student', collegeId: college._id }
      ]);
      user = await User.findOne({ email });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      // Populate college details
      await user.populate('collegeId');
      
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        collegeId: user.collegeId ? user.collegeId._id : null,
        collegeName: user.collegeId ? user.collegeId.name : 'Super Admin',
        token: generateToken(user._id, user.role)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
