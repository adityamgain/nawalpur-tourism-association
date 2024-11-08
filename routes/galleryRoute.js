const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

const upload = require('../middleware/uploadMiddleware');

// Route to display all gallery photos
router.get('/gallery', galleryController.getAllPhotos);

// Route to display the form to add a new photo
router.get('/gallery/add', ensureAuthenticated, galleryController.getAddPhotoForm);

// Route to handle the submission of a new photo (with image upload middleware)
router.post('/gallery/add', ensureAuthenticated, upload, galleryController.addNewPhoto);

// Route to display the form to edit an existing photo by its ID
router.get('/gallery/:id/edit', ensureAuthenticated, galleryController.getEditPhotoForm);

// Route to handle updating an existing photo (with image upload middleware)
router.post('/gallery/:id/edit', ensureAuthenticated, upload, galleryController.updatePhoto);

// Route to handle deleting a photo by its ID
router.delete('/gallery/:id', ensureAuthenticated, galleryController.deletePhoto);

module.exports = router;
