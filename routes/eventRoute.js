const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');


// Route to get all events
router.get('/events', eventController.getAllEvents);

// Route to display the form to add a new event
router.get('/events/add', ensureAuthenticated, eventController.getAddEventForm);

// Route to handle the submission of a new event
router.post('/events/add', ensureAuthenticated, eventController.addNewEvent);

// Route to display the form to edit an event by its ID
router.get('/events/:id/edit', ensureAuthenticated, eventController.getEditEventForm);

// Route to handle updating an event
router.post('/events/:id/edit', ensureAuthenticated, eventController.updateEvent);

// Route to handle deleting an event by its ID
router.delete('/events/:id', ensureAuthenticated, eventController.deleteEvent);

module.exports = router;
