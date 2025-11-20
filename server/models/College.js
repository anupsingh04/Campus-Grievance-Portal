const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // e.g., 'tech' for tech.localhost
  domain: { type: String, required: true, unique: true }, // e.g., 'campus.edu'
  address: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('College', collegeSchema);
