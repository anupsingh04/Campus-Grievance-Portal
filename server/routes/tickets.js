const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const { protect } = require('../middleware/authMiddleware');

// Get all tickets (Protected & Scoped to College)
router.get('/', protect, async (req, res) => {
  try {
    // Get user's college
    const User = require('../models/User');
    const currentUser = await User.findById(req.user.id);
    
    // SEEDING FOR DEMO
    const count = await Ticket.countDocuments();
    if (count === 0 && currentUser) {
      await Ticket.create([
        { title: 'Water cooler empty', description: '3rd floor cooler is empty.', category: 'Infrastructure', priority: 'Medium', userId: currentUser._id, collegeId: currentUser.collegeId, votes: 5 },
        { title: 'Library noise', description: 'Construction noise near library.', category: 'Academic', priority: 'High', userId: currentUser._id, collegeId: currentUser.collegeId, votes: 12 },
        { title: 'Cold food in mess', description: 'Dinner was served cold.', category: 'Cafeteria', priority: 'Medium', userId: currentUser._id, collegeId: currentUser.collegeId, votes: 3 }
      ]);
    }

    // Only show tickets from the SAME college
    const tickets = await Ticket.find({ collegeId: currentUser.collegeId }).sort({ createdAt: -1 });
    const formattedTickets = tickets.map(t => ({
      ...t.toObject(),
      id: t._id
    }));
    res.json(formattedTickets);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a ticket (Protected)
router.post('/', protect, async (req, res) => {
  const { title, description, category, priority } = req.body;
  
  try {
    const User = require('../models/User');
    const currentUser = await User.findById(req.user.id);

    const newTicket = new Ticket({
      title,
      description,
      category,
      priority,
      userId: req.user.id,
      collegeId: currentUser.collegeId, // Assign to user's college
      status: 'Open',
      votes: 0
    });

    const savedTicket = await newTicket.save();
    res.status(201).json({ ...savedTicket.toObject(), id: savedTicket._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Vote on a ticket (Protected)
router.patch('/:id/vote', protect, async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  const userId = req.user.id; // Get from Token

  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // Check if user already voted
    const existingVoteIndex = ticket.voters.findIndex(v => v.userId.toString() === userId);
    const existingVote = ticket.voters[existingVoteIndex];

    if (existingVote) {
      if (existingVote.action === action) {
        // Toggle off
        ticket.votes += (action === 'upvote' ? -1 : 1);
        ticket.voters.splice(existingVoteIndex, 1);
      } else {
        // Switch
        ticket.votes += (action === 'upvote' ? 2 : -2);
        existingVote.action = action;
      }
    } else {
      // New vote
      ticket.votes += (action === 'upvote' ? 1 : -1);
      ticket.voters.push({ userId, action });
    }

    await ticket.save();
    res.json({ ...ticket.toObject(), id: ticket._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update ticket status (Admin Protected)
router.patch('/:id/status', protect, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Check if admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }

  try {
    const ticket = await Ticket.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json({ ...ticket.toObject(), id: ticket._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
