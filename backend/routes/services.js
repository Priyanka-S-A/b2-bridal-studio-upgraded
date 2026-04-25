const express = require('express');
const Service = require('../models/Service');
const { verifyToken, verifyRole } = require('../middleware/auth');

const router = express.Router();

// Get all services (Public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a service (Admin/Owner)
router.post('/', verifyToken, verifyRole(['staff', 'owner']), async (req, res) => {
  try {
    const newService = new Service(req.body);
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a service (Admin/Owner)
router.delete('/:id', verifyToken, verifyRole(['staff', 'owner']), async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a service (Admin/Owner)
router.put('/:id', verifyToken, verifyRole(['staff', 'owner']), async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedService);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
