const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');


// ➕ ADD STAFF
router.post('/', async (req, res) => {
  try {
    const staff = new Staff(req.body);
    await staff.save();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 📥 GET ALL STAFF
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ❌ DELETE STAFF
router.delete('/:id', async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;