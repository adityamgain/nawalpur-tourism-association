const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

// Route to display the main hotel page
router.get('/hotel', hotelController.getAllHotels);

// Route to get the list of hotels
router.get('/hotel/list', hotelController.getHotelList);

// Route to display the form to add a new hotel
router.get('/hotel/list/add', ensureAuthenticated, hotelController.getAddHotelForm);

// Route to handle the submission of a new hotel
router.post('/hotel/list/add', ensureAuthenticated, hotelController.addNewHotel);

// Route to display the form to edit a hotel by its ID
router.get('/hotel/list/:id/edit', ensureAuthenticated, hotelController.getEditHotelForm);

// Route to handle updating a hotel
router.post('/hotel/list/:id/edit', ensureAuthenticated, hotelController.updateHotel);

// Route to handle deleting a hotel by its ID
router.delete('/hotel/list/delete/:id', ensureAuthenticated, hotelController.deleteHotel);

module.exports = router;
