const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    event: { type: String, required: true },
    date: { type: Date, required: true }, // Changed to Date type
    venue: { type: String, required: true },
    description: { type: String },
    contact: { type: Number }
});

// Create a Blog model
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;