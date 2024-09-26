const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },  // Store Cloudinary image URL here
    tag: { type: String, required:true }
});

// Create a Blog model
const Content = mongoose.model('Content', contentSchema);

module.exports = Content;