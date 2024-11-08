const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

// Login routes
router.get('/login', authController.getLoginPage);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);

// Dashboard route
router.get('/dashboard', ensureAuthenticated, authController.getDashboard);

module.exports = router;
