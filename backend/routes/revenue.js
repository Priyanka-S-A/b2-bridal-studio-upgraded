const express = require('express');
const Revenue = require('../models/Revenue');
const { verifyToken, verifyRole } = require('../middleware/auth');

const router = express.Router();

// ─── GET all revenue entries (Owner only) ────────────────────────────────────
router.get('/', verifyToken, verifyRole(['owner']), async (req, res) => {
  try {
    const entries = await Revenue.find()
      .sort({ date: -1 })
      .populate('billId', '_id');
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET revenue stats summary (Owner only) ──────────────────────────────────
router.get('/stats', verifyToken, verifyRole(['owner']), async (req, res) => {
  try {
    const entries = await Revenue.find();
    const total = entries.reduce((sum, e) => sum + e.total, 0);
    const online = entries.filter(e => e.source === 'online').reduce((sum, e) => sum + e.total, 0);
    const offline = entries.filter(e => e.source === 'offline').reduce((sum, e) => sum + e.total, 0);
    res.json({ total, online, offline, count: entries.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE revenue entry (Owner only) ────────────────────────────────────────
router.delete('/:id', verifyToken, verifyRole(['owner']), async (req, res) => {
  try {
    const deleted = await Revenue.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Revenue not found" });
    }
    res.json({ message: "Revenue deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
