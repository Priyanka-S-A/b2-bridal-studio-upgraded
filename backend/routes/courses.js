const express = require('express');
const Course = require('../models/Course');
const { verifyToken, verifyRole } = require('../middleware/auth');

const router = express.Router();


// 🔹 GET ALL COURSES (Public)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }); // 🔥 sorted
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔹 GET COURSES BY CATEGORY (Public)
router.get('/category/:category', async (req, res) => {
  try {
    const courses = await Course.find({
      category: { 
        $regex: new RegExp(`^${req.params.category}$`, 'i') 
      }
    });

    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔹 ADD COURSE (Admin / Owner)
router.post('/', verifyToken, verifyRole(['staff', 'owner']), async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();

    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// 🔹 UPDATE COURSE (Admin / Owner)
router.put('/:id', verifyToken, verifyRole(['staff', 'owner']), async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// 🔹 DELETE COURSE (Admin / Owner)
router.delete('/:id', verifyToken, verifyRole(['staff', 'owner']), async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;