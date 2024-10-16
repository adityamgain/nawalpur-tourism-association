const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    imageUrl: { type: String,required: true },  // Store Cloudinary image URL here
    content: { type: String},
    Photoby: { type: String, required: true  },  // Store Cloudinary image URL here
    tag: { type: String, required:true }
});

// Create a Blog model
const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;