const Gallery = require('../models/gallery');
const cloudinary = require('cloudinary').v2;


exports.getAllPhotos = async (req, res) => {
    try {
        const gallerydetail = await Gallery.find(); 
        res.render('gallery', { gallerydetail,currentPage: 'event'  });
    } catch (err) {
        console.error('Error fetching gallery:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.getAddPhotoForm = (req, res) => {
    res.render('addphotos', { currentPage: 'gallery' });
};

exports.addNewPhoto = async (req, res) => {
    try {
        const { Photoby, content, tag } = req.body;
        const imageUrl = req.file.path; // Get the image URL from the uploaded file

        // Create a new gallery item
        const newGallery = new Gallery({
            Photoby,
            content,
            imageUrl,
            tag 
        });
        await newGallery.save();
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Error creating gallery item:', err);
        res.status(500).json({ error: 'Error creating gallery item' });
    }
};

exports.getEditPhotoForm = async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.id);
        if (!gallery) {
            return res.status(404).send('Blog not found');
        }
        res.render('editgallery', { gallery, currentPage: 'none'});
    } catch (err) {
        console.error('Error fetching gallery for edit:', err);
        res.status(500).send('Internal Server Error');
    }};

exports.updatePhoto = async (req, res) => {
    const { Photoby, content, tag } = req.body; // Get data from the form
    let imageUrl;

    try {
        // Find the existing gallery item
        const galleryItem = await Gallery.findById(req.params.id);
        if (!galleryItem) {
            return res.status(404).send('Gallery item not found');
        }

        // Check if a new image was uploaded
        if (req.file) {
            // If a new image is uploaded, delete the previous image from Cloudinary
            const publicId = galleryItem.imageUrl.split('/').slice(-2).join('/').split('.')[0]; // Extract public ID
            console.log(`Attempting to delete image with public ID: ${publicId}`); // Log for debugging

            const deletionResult = await cloudinary.uploader.destroy(publicId); // Delete the existing image
            console.log('Deletion result:', deletionResult); // Log the result

            // Get the new image URL from Cloudinary
            imageUrl = req.file.path; 
        } else {
            // If no new image is uploaded, keep the existing image URL
            imageUrl = galleryItem.imageUrl; 
        }

        // Update the gallery item with new data
        const updateData = {
            Photoby,
            content,
            tag,
            imageUrl // Always set imageUrl, whether it’s updated or the same
        };

        const updatedGalleryItem = await Gallery.findByIdAndUpdate(
            req.params.id,
            updateData, // Fields to update
            { new: true, runValidators: true } // Return the updated document and validate
        );

        if (!updatedGalleryItem) {
            return res.status(404).send('Gallery item not found');
        }

        res.redirect('/dashboard'); // Redirect to the list of gallery items
    } catch (err) {
        console.error('Error updating gallery data:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.deletePhoto = async (req, res) => {
    try {
        // Find the gallery item to get the image URL
        const galleryItem = await Gallery.findById(req.params.id);
        if (!galleryItem) {
            return res.status(404).send('Gallery item not found');
        }

        // Extract the public ID from the image URL
        const publicId = galleryItem.imageUrl.split('/').slice(-2).join('/').split('.')[0]; // Extract public ID
        console.log(`Deleting image with public ID: ${publicId}`); // Log for debugging

        // Delete the image from Cloudinary
        const deletionResult = await cloudinary.uploader.destroy(publicId);
        console.log('Deletion result:', deletionResult); // Log the result

        // Delete the gallery item from the database
        await Gallery.findByIdAndDelete(req.params.id);
        
        res.redirect('/dashboard'); // Redirect to the gallery list after deletion
    } catch (err) {
        console.error('Error deleting gallery:', err);
        res.status(500).send('Internal Server Error');
    }
};
