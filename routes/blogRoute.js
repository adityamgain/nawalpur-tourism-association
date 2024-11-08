const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const upload = require('../middleware/uploadMiddleware');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');



// Route to get all blog posts
router.get('/blogs', blogController.getAllBlogs);

// Route to get a specific blog post by ID
router.get('/blogs/:id', blogController.getBlogById);

// Route to display the form to add a new blog post
router.get('/addblogs',ensureAuthenticated, blogController.getAddBlogForm);

// Route to handle the submission of a new blog post (with image upload middleware)
router.post('/addblogs', ensureAuthenticated, upload, blogController.addNewBlog);

// Route to display the form to edit an existing blog post by its ID
router.get('/blogs/:id/edit',ensureAuthenticated, blogController.getEditBlogForm);

// Route to handle updating an existing blog post (with image upload middleware)
router.post('/blogs/:id/edit',ensureAuthenticated, upload, blogController.updateBlog);

// Route to handle deleting a blog post by its ID
router.delete('/blogs/:id',ensureAuthenticated, blogController.deleteBlog);

module.exports = router;
