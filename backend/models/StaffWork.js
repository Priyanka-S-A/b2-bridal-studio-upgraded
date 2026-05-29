const mongoose = require('mongoose');

const serviceItemSchema = new mongoose.Schema({
  category: { type: String, required: true },
  serviceName: { type: String, required: true }
}, { _id: false });

const staffWorkSchema = new mongoose.Schema({
  staffId: { type: String, required: true }, // custom staff code (e.g. STF001)
  staffName: { type: String, required: true }, // staff name snapshot
  customerName: { type: String, required: true },
  services: { type: [serviceItemSchema], required: true },
  workDate: { type: Date, required: true },
  createdTimestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StaffWork', staffWorkSchema);
