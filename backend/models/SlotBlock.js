const mongoose = require('mongoose');

const slotBlockSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD format
  type: { type: String, enum: ['Full Day', 'Time Range'], required: true },
  startTime: { type: String }, // "10" -> e.g., 10 AM, maps to HOUR_SLOTS values
  endTime: { type: String }, // "13" -> e.g., 1 PM
  branch: { type: String, enum: ['All', 'Chennai', 'Madurai'], default: 'All', required: true },
  reason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('SlotBlock', slotBlockSchema);
