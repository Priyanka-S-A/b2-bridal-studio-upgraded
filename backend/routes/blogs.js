const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// GET all published blogs (list view — excludes full content)
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true })
      .select('-content')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single blog by slug (detail view)
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
