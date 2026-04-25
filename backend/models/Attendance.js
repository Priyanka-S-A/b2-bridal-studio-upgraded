const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  date: Date,
  entryTime: String,
  exitTime: String
});

module.exports = mongoose.model('Attendance', attendanceSchema);