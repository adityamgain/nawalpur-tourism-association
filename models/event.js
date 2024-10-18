const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    event: { type: String, required: true },
    date: { type: String, required: true },
    venue: { type: String }
});

// Create a Blog model
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;