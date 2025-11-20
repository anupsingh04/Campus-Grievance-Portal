const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In real app, hash this!
  role: { type: String, enum: ['student', 'admin', 'superadmin'], default: 'student' },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' }, // Optional for superadmin
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
