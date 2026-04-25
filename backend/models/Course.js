const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  category: { type: String, required: true }, // e.g., 'Beautician', 'Fashion'
  title: { type: String, required: true },    // e.g., 'Makeup Artist Course'
  duration: { type: String, required: true },
  description: { type: String, default: '' },
  learnings: [{ type: String }],              // bullet points
}, { timestamps: true }); // 🔥 ADD THIS

module.exports = mongoose.model('Course', courseSchema);