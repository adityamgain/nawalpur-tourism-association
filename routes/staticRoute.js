const express = require('express');
const router = express.Router();

// About Us Route
router.get('/aboutus', (req, res) => {
    res.render('aboutus', { currentPage: 'about' });
});

// Other static routes can be added here

module.exports = router;
