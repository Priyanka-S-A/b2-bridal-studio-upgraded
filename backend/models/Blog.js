const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  preview: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  author: { type: String, default: 'B2 Bridal Studio' },
  readTime: { type: String, default: '5 min read' },
  tags: [String],
  published: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
