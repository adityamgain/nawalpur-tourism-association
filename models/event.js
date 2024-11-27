const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    event: { type: String, required: true },
    date: { type: Date, required: true }, // Changed to Date type
    venue: { type: String },
    description: { type: String, required: true },
    contact: { type: Number, required: true }
});

// Create a Blog model
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;