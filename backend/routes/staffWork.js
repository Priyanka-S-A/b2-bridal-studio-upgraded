const express = require('express');
const router = express.Router();
const StaffWork = require('../models/StaffWork');
const { verifyToken, verifyRole } = require('../middleware/auth');

// 📥 GET all staff work logs (Admin/Staff/Owner)
router.get('/', verifyToken, verifyRole(['staff', 'owner']), async (req, res) => {
  try {
    const logs = await StaffWork.find().sort({ workDate: -1, createdTimestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ ADD staff work log (Admin/Staff/Owner)
router.post('/', verifyToken, verifyRole(['staff', 'owner']), async (req, res) => {
  try {
    const { staffId, staffName, customerName, services, workDate } = req.body;
    if (!staffId || !staffName || !customerName || !services || !services.length || !workDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const log = new StaffWork({
      staffId,
      staffName,
      customerName,
      services,
      workDate: new Date(workDate)
    });
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ❌ DELETE staff work log (Admin/Staff/Owner)
router.delete('/:id', verifyToken, verifyRole(['staff', 'owner']), async (req, res) => {
  try {
    const deleted = await StaffWork.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
