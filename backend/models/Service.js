const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const serviceSchema = new mongoose.Schema({
  category: { type: String, required: true }, // e.g., 'Waxing', 'Facial'
  name: { type: String, required: true },
  price: { type: Number }, // Optional if options exist
  options: [optionSchema] // Nested options like Raga/Fruit
});

module.exports = mongoose.model('Service', serviceSchema);
