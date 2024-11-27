const passport = require('passport');
const Blog = require('../models/blog');
const Notice = require('../models/notice');
const Gallery = require('../models/gallery');
const Event = require('../models/event');
const Hotel = require('../models/hotel');

// Render login page
exports.getLoginPage = (req, res) => {
    res.render('login', {
        errorMessage: req.flash('error'), // Display any error messages stored in flash
    });
};

// Handle login request
exports.postLogin = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
};

// Handle logout request
exports.logout = (req, res) => {
    req.logout(err => { // Call the Passport logout function
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({
                message: 'Logout failed',
                error: err,
            });
        }
        req.session.destroy(destroyErr => { // Destroy session explicitly
            if (destroyErr) {
                console.error('Session destruction error:', destroyErr);
                return res.status(500).json({
                    message: 'Session destruction failed',
                    error: destroyErr,
                });
            }
            res.redirect('/login'); // Redirect to login page
        });
    });
}

// Render dashboard with data
exports.getDashboard = async (req, res) => {
    try {
        const latestBlogs = await Blog.find();
        const latestNotices = await Notice.find();
        const gallery = await Gallery.find();
        const upcomingEvents = await Event.find();
        const hotelsList = await Hotel.find();

        res.render('dashboard', {
            blogs: latestBlogs,
            notices: latestNotices,
            gallery: gallery,
            events: upcomingEvents,
            hotels: hotelsList,
            currentPage: 'dashboard'
        });
    } catch (err) {
        console.error('Error fetching dashboard data:', err);
        res.status(500).send('Internal Server Error');
    }
};
