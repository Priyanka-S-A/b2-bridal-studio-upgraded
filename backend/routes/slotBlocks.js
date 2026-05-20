const express = require('express');
const router = express.Router();
const SlotBlock = require('../models/SlotBlock');

// GET /api/slot-blocks - Fetch all slot blocks
router.get('/', async (req, res) => {
  try {
    const blocks = await SlotBlock.find().sort({ date: -1, startTime: 1 });
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/slot-blocks - Create a new slot block
router.post('/', async (req, res) => {
  try {
    const { date, type, startTime, endTime, branch, reason } = req.body;

    if (!date || !type) {
      return res.status(400).json({ error: 'Date and Type are required' });
    }

    if (type === 'Time Range') {
      if (!startTime || !endTime) {
        return res.status(400).json({ error: 'Start Time and End Time are required for Time Range blocks' });
      }
      if (parseInt(startTime, 10) >= parseInt(endTime, 10)) {
        return res.status(400).json({ error: 'Start Time must be before End Time' });
      }
    }

    // Optional check for exact duplicate block to prevent redundant records
    const query = {
      date,
      type,
      branch: branch || 'All'
    };
    if (type === 'Time Range') {
      query.startTime = startTime;
      query.endTime = endTime;
    }

    const existing = await SlotBlock.findOne(query);
    if (existing) {
      return res.status(400).json({ error: 'An identical block already exists for this date and branch' });
    }

    const block = new SlotBlock({
      date,
      type,
      startTime: type === 'Time Range' ? startTime : undefined,
      endTime: type === 'Time Range' ? endTime : undefined,
      branch: branch || 'All',
      reason
    });

    await block.save();
    res.status(201).json(block);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/slot-blocks/:id - Delete / unblock a slot
router.delete('/:id', async (req, res) => {
  try {
    const block = await SlotBlock.findByIdAndDelete(req.params.id);
    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }
    res.json({ message: 'Slot/Date unblocked successfully', block });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
