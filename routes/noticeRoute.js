const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const upload = require('../middleware/uploadMiddleware');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

// Route to fetch and display all notices
router.get('/notices', noticeController.getAllNotices);

// Route to fetch a specific notice by ID
router.get('/notices/:id', noticeController.getNoticeById);

router.get('/notices/download/:id', noticeController.downloadNoticeImage);
// Route to download the notice

// Route to display the form to add a new notice
router.get('/addnotice', ensureAuthenticated, noticeController.getAddNoticeForm);

// Route to handle the submission of a new notice
router.post('/addnotice', ensureAuthenticated, upload, noticeController.addNewNotice);

// Route to display the form to edit a notice by its ID
router.get('/notices/edit/:id', ensureAuthenticated, noticeController.getEditNoticeForm);

// Route to handle updating a notice
router.post('/notices/edit/:id', ensureAuthenticated, upload, noticeController.updateNotice);

// Route to handle deleting a notice by its ID
router.delete('/notice/:id', ensureAuthenticated, noticeController.deleteNotice);

module.exports = router;
