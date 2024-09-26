const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String },  // Store Cloudinary image URL here
    createdAt: { type: Date, default: Date.now }
});

// Create a Blog model
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;