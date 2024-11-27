const cloudinary = require('cloudinary').v2;
const Blog = require('../models/blog');

exports.getAllBlogs = async (req, res) => {
    try {
        const blogsdetail = await Blog.find(); 
        res.render('blogs', { blogsdetail, currentPage: 'blog' });
    } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.getBlogById = async (req, res) => {
    const data = await Blog.findById(req.params.id);
    res.render('blogDescription', { data, currentPage: 'blog' });
};

exports.getAddBlogForm = (req, res) => {
    res.render('addblog', { currentPage: 'blog' });
};

exports.addNewBlog = async (req, res) => {
    try {
        const { title, content, author } = req.body;
    
        // Ensure the image file was uploaded to Cloudinary
        if (!req.file) {
          return res.status(400).json({ error: 'No image file uploaded' });
        }
    
        // Get the Cloudinary image URL from the uploaded file
        const imageUrl = req.file.path;
    
        // Create a new blog post with the Cloudinary URL for the image
        const newBlog = new Blog({
          title,
          content,
          author,
          imageUrl // Save the Cloudinary URL to the database
        });
    
        await newBlog.save();
    
        res.redirect('/dashboard');
      } catch (err) {
        console.error('Error creating blog:', err);
        res.status(500).json({ error: 'Error creating blog post' });
      }
};

exports.getEditBlogForm = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        res.render('editblog', { blog, currentPage: 'blog' });
    } catch (err) {
        console.error('Error fetching blog for edit:', err);
        res.status(500).send('Internal Server Error');
    }};

exports.updateBlog = async (req, res) => {
    const { title, content, author } = req.body; // Get data from the form
    let imageUrl;

    try {
        // Find the existing blog post
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).send('Blog post not found');
        }

        // Check if a new image was uploaded
        if (req.file) {
            // If a new image is uploaded, delete the previous image from Cloudinary
            const publicId = blog.imageUrl.split('/').slice(-2).join('/').split('.')[0]; // Extract public ID
            console.log(`Attempting to delete image with public ID: ${publicId}`); // Log for debugging

            const deletionResult = await cloudinary.uploader.destroy(publicId); // Delete the existing image
            console.log('Deletion result:', deletionResult); // Log the result

            // Get the new image URL from Cloudinary
            imageUrl = req.file.path; 
        } else {
            // If no new image is uploaded, keep the existing image URL
            imageUrl = blog.imageUrl; 
        }

        // Update the blog post with new data
        const updateData = {
            title,
            content,
            author,
            imageUrl // Always set imageUrl, whether it’s updated or the same
        };

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            updateData, // Fields to update
            { new: true, runValidators: true } // Return the updated document and validate
        );

        if (!updatedBlog) {
            return res.status(404).send('Blog post not found');
        }

        res.redirect('/dashboard'); // Redirect to the list of blog posts
    } catch (err) {
        console.error('Error updating blog:', err);
        res.status(500).send('Internal Server Error');
    }};

exports.deleteBlog = async (req, res) => {
    try {
        const blogPost = await Blog.findById(req.params.id);
        if (!blogPost) {
            return res.status(404).send('Blog post not found');
        }

        // Extract public ID and log for debugging
        const publicId = blogPost.imageUrl.split('/').slice(-2).join('/').split('.')[0];
        console.log(`Public ID to delete: ${publicId}`);

        // Delete the image from Cloudinary and log the result
        const deletionResult = await cloudinary.uploader.destroy(publicId);
        console.log('Cloudinary deletion result:', deletionResult);

        if (deletionResult.result !== 'ok') {
            console.error('Error deleting image from Cloudinary:', deletionResult);
            return res.status(500).send('Error deleting image from Cloudinary');
        }

        // Delete the blog post from the database
        await Blog.findByIdAndDelete(req.params.id);
        
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Error deleting blog:', err);
        res.status(500).send('Internal Server Error');
    }
};
