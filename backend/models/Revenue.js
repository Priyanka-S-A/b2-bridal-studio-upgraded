const mongoose = require('mongoose');

const revenueSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  customer: { type: String, default: 'Walk-in' },
  total: { type: Number, required: true },
  source: { type: String, enum: ['online', 'offline'], required: true },
  paymentMethod: { type: String, enum: ['cash', 'upi', 'card'], default: 'cash' },
  billId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill' },
  branch: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Revenue', revenueSchema);
