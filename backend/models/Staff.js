const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  age: Number
});

module.exports = mongoose.model('Staff', staffSchema);