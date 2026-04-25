const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');

// 🔹 REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new Customer({
      name,
      email,
      phone,
      password: hashed
    });

    await user.save();

    res.json({
      message: "Registered",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Customer.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Wrong password" });
    }

    res.json({
      message: "Login success",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;