const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  staffId: String,
  name: String,
  phone: String,
  email: String,
  age: Number
});

module.exports = mongoose.model('Staff', staffSchema);