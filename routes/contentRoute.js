const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

// // // Route to fetch adventure content
// router.get('/adventure', contentController.getAdventureContent);

// // // Route to fetch nature content
// router.get('/nature', contentController.getNatureContent);

// // // Route to fetch culture content
// router.get('/culture', contentController.getCultureContent);

// // // Route to fetch wellness content
// router.get('/wellness', contentController.getWellnessContent);

// // Route to fetch a specific content item by ID
// router.get('/things-to-do/:id', contentController.getContentById);


// Route to fetch content based on the tag (adventure, nature, culture, wellness)
router.get('/:tag', contentController.getContentByTag);

// Route to fetch a specific content item by ID
router.get('/things-to-do/:id', contentController.getContentById);

module.exports = router;
