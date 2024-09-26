const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    imageUrl: { type: String },  // Store Cloudinary image URL here
    createdAt: { type: Date, default: Date.now }
});

// Create a Blog model
const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;