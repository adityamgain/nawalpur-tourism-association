const Notice = require('../models/notice');
const cloudinary = require('cloudinary').v2;


exports.getAllNotices = async (req, res) => {
    try {
        const noticesdetail = await Notice.find().sort({ createdAt: -1 });
        res.render('notices', { noticesdetail, currentPage: 'notice' });
    } catch (error) {
        console.error('Error fetching notices:', error);
        res.status(500).json({ error: 'Error fetching notices' });
    }
};

exports.getNoticeById = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (!notice) {
            return res.status(404).json({ error: 'Notice not found' });
        }
        res.render('noticeDescription', { notice, currentPage: 'notice' });
    } catch (error) {
        console.error('Error fetching notice:', error);
        res.status(500).json({ error: 'Error fetching notice' });
    }
};

exports.getAddNoticeForm = (req, res) => {
    res.render('addnotice', { currentPage: 'notice' });
};

exports.addNewNotice = async (req, res) => {
    try {
        const { title } = req.body;

      // Ensure the image file was uploaded to Cloudinary
      if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
      }
      // Get the Cloudinary image URL from the uploaded file
      const imageUrl = req.file.path;

        // Create a new blog post
        const newNotice = new Notice({
            title,
            imageUrl 
        });

        await newNotice.save();

        res.redirect('/dashboard');
    } catch (err) {
        console.error('Error creating blog:', err);
        res.status(500).json({ error: 'Error creating notice ' });
    }
};

exports.getEditNoticeForm = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id); // Find the notice by ID
        if (!notice) {
            return res.status(404).send('Notice not found');
        }
        res.render('editnotice', { notice, currentPage: 'notice' }); // Render the edit form
    } catch (err) {
        console.error('Error fetching notice for edit:', err);
        res.status(500).send('Internal Server Error');
    }};

exports.updateNotice = async (req, res) => {
    const { title } = req.body; // Get the title from the form
    let imageUrl;

    try {
        // Find the existing notice
        const notice = await Notice.findById(req.params.id);
        if (!notice) {
            return res.status(404).send('Notice not found');
        }

        // Check if an image was uploaded
        if (req.file) {
            // If a new image is uploaded, delete the previous image from Cloudinary
            const publicId = notice.imageUrl.split('/').slice(-2).join('/').split('.')[0]; // Extract public ID
            console.log(`Attempting to delete image with public ID: ${publicId}`); // Log public ID for debugging

            const deletionResult = await cloudinary.uploader.destroy(publicId); // Delete the existing image
            console.log('Deletion result:', deletionResult); // Log deletion result

            // Get the new image URL from Cloudinary
            imageUrl = req.file.path; 
        } else {
            // If no new image is uploaded, keep the existing image URL
            imageUrl = notice.imageUrl; 
        }

        // Update notice with new data
        const updateData = {
            title,
            imageUrl // Always set imageUrl, whether it’s updated or the same
        };

        const updatedNotice = await Notice.findByIdAndUpdate(
            req.params.id,
            updateData, // Fields to update
            { new: true, runValidators: true } // Return the updated document and validate
        );

        if (!updatedNotice) {
            return res.status(404).send('Notice not found');
        }

        res.redirect('/dashboard'); // Redirect back to the notices list after update
    } catch (err) {
        console.error('Error updating notice:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteNotice = async (req, res) => {
    try {
        // Find the notice to get the image URL
        const notice = await Notice.findById(req.params.id);
        if (!notice) {
            return res.status(404).send('Notice not found');
        }

        // Extract the public ID from the image URL
        const publicId = notice.imageUrl.split('/').slice(-2).join('/').split('.')[0]; // Extract public ID
        console.log(`Deleting image with public ID: ${publicId}`); // Log for debugging

        // Delete the image from Cloudinary
        const deletionResult = await cloudinary.uploader.destroy(publicId);
        console.log('Deletion result:', deletionResult); // Log the result

        // Delete the notice from the database
        await Notice.findByIdAndDelete(req.params.id);
        
        res.redirect('/dashboard'); // Redirect to the notices list after deletion
    } catch (err) {
        console.error('Error deleting notice:', err);
        res.status(500).send('Internal Server Error');
    }};
