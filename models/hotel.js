const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    website: { type: String, required: true },
    location: { type: String, required: true  },  // Store Cloudinary image URL here
});

// Create a Blog model
const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;