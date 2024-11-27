const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dga2mpvuf', 
  api_key: process.env.CLOUDINARY_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET 
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'amaltari', 
    allowed_formats: ['jpeg', 'png', 'jpg', 'gif'], 
  },
});

// Initialize multer with the Cloudinary storage
const upload = multer({ storage: storage }).single('imageFile');

// Export 
module.exports = upload;
