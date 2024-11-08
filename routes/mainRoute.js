// routes/mainRoute.js
const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

// Home route that calls the renderHomePage method from the home controller
router.get('/', mainController.renderHomePage);

module.exports = router;
