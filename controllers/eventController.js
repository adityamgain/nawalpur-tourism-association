const Event = require('../models/event');

const NepaliDate = require('nepali-date-converter');


exports.getAllEvents = async (req, res) => {
    try {
        const eventlist = await Event.find().sort({ date: 1 });

        // Convert the dates of events into Nepali and format them
        const eventlistWithNepaliDates = eventlist.map(event => {
            const eventDate = new Date(event.date);
            const englishFormattedDate = eventDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short', // Short month for English date
                year: 'numeric'
            });

            const nepaliDate = new NepaliDate(eventDate);
            // Use full month name for Nepali date
            const nepaliFormattedDate = nepaliDate.format('DD MMMM YYYY'); // Full month name

            return {
                ...event._doc,
                englishDate: englishFormattedDate, // eg, "12 Jul 2024"
                nepaliDate: nepaliFormattedDate // eg, "28 Asar 2081"
            };
        });

        res.render('events', { eventlist: eventlistWithNepaliDates, currentPage: 'event' });
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.getAddEventForm = (req, res) => {
    res.render('addevents',{ currentPage: 'event' })
};

exports.addNewEvent = async (req, res) => {
    try {
        const { event, date, venue, description, contact } = req.body;

        // Convert the date from string to JavaScript Date object
        const eventDate = new Date(date);

        // Create a new event
        const newEvent = new Event({
            event,
            date: eventDate, // Use the converted Date object
            venue,
            description,
            contact
        });
        await newEvent.save();
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Error adding new event:', err);
        res.status(500).json({ error: 'Error adding new event' });
    }
};

exports.getEditEventForm = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send('event not found');
        }
        res.render('editevent', { event, currentPage: 'event'});
    } catch (err) {
        console.error('Error fetching event for edit:', err);
        res.status(500).send('Internal Server Error');
    }};

exports.updateEvent = async (req, res) => {
    const { event, date, venue, description, contact } = req.body;
    try {
        await Event.findByIdAndUpdate(req.params.id, { event, date, venue, description, contact }, { new: true });
        res.redirect(`/dashboard`); // Redirect to the updated blog post
    } catch (err) {
        console.error('Error updating event data:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.redirect('/dashboard'); // Redirect to the blogs list after deletion
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).send('Internal Server Error');
    }
};
