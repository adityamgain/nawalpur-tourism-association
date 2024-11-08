const express = require('express');
require('dotenv').config();
const path=require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const multer = require('multer');
const methodOverride = require('method-override');
const NepaliDate = require('nepali-date-converter');
const cloudinary = require('cloudinary').v2;
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const fs = require('fs');

// models
const Blog = require('./models/blog');
const Notice = require('./models/notice');
const Content = require('./models/content');
const Hotel = require('./models/hotel');
const Gallery = require('./models/gallery');
const Event = require('./models/event');
const Admin = require('./models/admin');
const ensureAuthenticated = require('./middleware/ensureAuthenticated');
const deletePastEvents = require('./utils/eventCron');

const app = express();

// Route imports
const mainRoutes = require('./routes/mainRoute');
const contentRoutes = require('./routes/contentRoute');
const blogRoutes = require('./routes/blogRoute');
const noticeRoutes = require('./routes/noticeRoute');
const hotelRoutes = require('./routes/hotelRoute');
const eventRoutes = require('./routes/eventRoute');
const galleryRoutes = require('./routes/galleryRoute');
const authRoutes = require('./routes/authRoute');
const staticRoutes = require('./routes/staticRoute');

const hostname = 'localhost';
const port = 3000;
app.engine('ejs',ejsMate);
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dgdbgblvb', // Replace with your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET 
});

// Serve static files
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.json());   
app.use(express.urlencoded({ extended: true }));  
app.use(session({
    secret: 'secret-key', // Change this to a more secure key
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());
  
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, admin);
    } catch (error) {
      return done(error);
    }
  }));
  
  // Serialize and deserialize user
  passport.serializeUser((admin, done) => {
    done(null, admin.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const admin = await Admin.findById(id);
      done(null, admin);
    } catch (error) {
      done(error);
    }
  });

// MongoDB Atlas connection string
const uri = process.env.DB;

mongoose.connect(uri)
    .then(() => console.log("Database connected"))
    .catch(err => console.error("Error connecting to MongoDB Atlas:", err));


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'amaltari',  // Specify a folder in Cloudinary where images will be stored
      allowed_formats: ['jpeg', 'png', 'jpg', 'gif'], // Allowed image formats
    },
  });
  
  // Initialize Multer upload with Cloudinary storage
  const upload = multer({ storage: storage }).single('imageFile');

// Use the static routes
app.use('/', staticRoutes);

// Use the routes
app.use('/', mainRoutes);
app.use('/', authRoutes);
app.use('/', blogRoutes);
app.use('/', noticeRoutes);
app.use('/', hotelRoutes);
app.use('/', eventRoutes);
app.use('/', galleryRoutes);
app.use('/', contentRoutes);
  
//   app.get('/', async(req, res) => {
//     const latestBlogs = await Blog.find().sort({ createdAt: -1 }).limit(3); // Get latest 3 blogs
//     const latestNotices = await Notice.find().sort({ createdAt: -1 }).limit(6); // Get latest 6 notices
//     const galleryphotos = await Gallery.aggregate([{ $sample: { size: 8 } }]);
//     const upcomingevents = await Event.find().sort({ date: 1 }).limit(3);

//     res.render('home', { blogs: latestBlogs, notices: latestNotices, photos:galleryphotos, events: upcomingevents, currentPage: 'home' });
// });


// app.get('/about-us', (req, res) => {
//   res.render('aboutus',{ currentPage: 'about' });
// });

// app.get('/adventure', async (req, res) => {
//     const tagCondition = 'activity';
//     const contentdetail = await Content.find({ tag: tagCondition });  
//     res.render('adventure',{ contentdetail,currentPage: 'things-to-do' })
// });
  
// app.get('/nature',async (req, res) => {
//     const tagCondition = 'nature';
//     const contentdetail = await Content.find({ tag: tagCondition });  
//     res.render('nature',{ contentdetail,currentPage: 'things-to-do' })
//   });

// app.get('/culture',async (req, res) => {
//     const tagCondition = 'culture';
//     const contentdetail = await Content.find({ tag: tagCondition });  
//   res.render('culture',{ contentdetail,currentPage: 'things-to-do' })
// });

// app.get('/wellness',async (req, res) => {
//     const tagCondition = 'wellness';
//     const contentdetail = await Content.find({ tag: tagCondition });  
//   res.render('wellbeing',{ contentdetail,currentPage: 'things-to-do' })
// });   

// app.get('/things-to-do/:id',async(req,res)=>{
//     const id = req.params.id; 
//     const data = await Content.findById(id);
//     res.render('description',{ data,currentPage: 'things-to-do' })
// })

// app.get('/hotel', (req, res) => {
//   res.render('hotel',{ currentPage: 'hotel' });
// }); 

// app.get('/hotel/list', async (req, res) => {
//     try {
//         // Fetch all blog posts from the database
//         const hotelslist = await Hotel.find().sort({ name: 1 });
//         res.render('hotellist',{ hotelslist,currentPage: 'hotel' });
//     } catch (err) {
//         console.error('Error fetching blogs:', err);
//         res.status(500).send('Internal Server Error');
//     }
//   });


//   app.get('/hotel/list/add',ensureAuthenticated,async(req,res)=>{
//     res.render('addhotellist',{ currentPage: 'hotel' })
//   });

//   app.post('/hotel/list/add', async (req, res) => {
//     try {
//         const { name, website, location } = req.body;
//         // Create a new blog post
//         const newHotel = new Hotel({
//             name,
//             website,
//             location
//         });

//         await newHotel.save();

//         res.redirect('/dashboard')
//     } catch (err) {
//         console.error('Error creating blog:', err);
//         res.status(500).json({ error: 'Error creating blog post' });
//     }
// });

// app.get('/hotel/list/:id/edit', ensureAuthenticated, async (req, res) => {
//     try {
//         const hotel = await Hotel.findById(req.params.id);
//         if (!hotel) {
//             return res.status(404).send('Blog not found');
//         }
//         res.render('edithotellist', { hotel, currentPage: 'hotel' });
//     } catch (err) {
//         console.error('Error fetching blog for edit:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// // Route to handle the update
// app.post('/hotel/list/:id/edit', async (req, res) => {
//     const { name, website, location } = req.body;
//     try {
//         await Hotel.findByIdAndUpdate(req.params.id, { name, website, location }, { new: true });
//         res.redirect('/dashboard'); // Redirect to the updated blog post
//     } catch (err) {
//         console.error('Error updating blog:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// app.delete('/hotel/list/delete/:id',ensureAuthenticated, async (req, res) => {
//     try {
//         await Hotel.findByIdAndDelete(req.params.id);
//         res.redirect('/dashboard'); // Redirect to the blogs list after deletion
//     } catch (err) {
//         console.error('Error deleting blog:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// app.get('/events',async(req,res)=>{
//     try {
//         const eventlist = await Event.find();

//         // Convert the dates of events into Nepali and format them
//         const eventlistWithNepaliDates = eventlist.map(event => {
//             const eventDate = new Date(event.date);
//             const englishFormattedDate = eventDate.toLocaleDateString('en-GB', {
//                 day: '2-digit',
//                 month: 'short', // Short month for English date
//                 year: 'numeric'
//             });

//             const nepaliDate = new NepaliDate(eventDate);
//             // Use full month name for Nepali date
//             const nepaliFormattedDate = nepaliDate.format('DD MMMM YYYY'); // Full month name

//             return {
//                 ...event._doc,
//                 englishDate: englishFormattedDate, // e.g., "12 Jul 2024"
//                 nepaliDate: nepaliFormattedDate // e.g., "28 Asar 2081"
//             };
//         });

//         res.render('events', { eventlist: eventlistWithNepaliDates, currentPage: 'event' });
//     } catch (err) {
//         console.error('Error fetching events:', err);
//         res.status(500).send('Internal Server Error');
//     }
// })

// app.get('/events/add',ensureAuthenticated, async(req,res)=>{
//     res.render('addevents',{ currentPage: 'event' })
//   });
//   app.post('/events/add', async (req, res) => {
//     try {
//         const { event, date, venue, description, contact } = req.body;

//         // Convert the date from string to JavaScript Date object
//         const eventDate = new Date(date);

//         // Create a new event
//         const newEvent = new Event({
//             event,
//             date: eventDate, // Use the converted Date object
//             venue,
//             description,
//             contact
//         });
//         await newEvent.save();
//         res.redirect('/dashboard');
//     } catch (err) {
//         console.error('Error adding new event:', err);
//         res.status(500).json({ error: 'Error adding new event' });
//     }
// });


// app.get('/events/:id/edit', ensureAuthenticated, async (req, res) => {
//     try {
//         const event = await Event.findById(req.params.id);
//         if (!event) {
//             return res.status(404).send('event not found');
//         }
//         res.render('editevent', { event, currentPage: 'event'});
//     } catch (err) {
//         console.error('Error fetching event for edit:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// app.post('/events/:id/edit', async (req, res) => {
//     const { event, date, venue, description, contact } = req.body;
//     try {
//         await Event.findByIdAndUpdate(req.params.id, { event, date, venue, description, contact }, { new: true });
//         res.redirect(`/dashboard`); // Redirect to the updated blog post
//     } catch (err) {
//         console.error('Error updating event data:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// app.delete('/events/:id', ensureAuthenticated, async (req, res) => {
//     try {
//         await Event.findByIdAndDelete(req.params.id);
//         res.redirect('/dashboard'); // Redirect to the blogs list after deletion
//     } catch (err) {
//         console.error('Error deleting event:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// app.get('/gallery', async (req, res) => {
//     try {
//         const gallerydetail = await Gallery.find(); 
//         res.render('gallery', { gallerydetail,currentPage: 'event'  });
//     } catch (err) {
//         console.error('Error fetching gallery:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// app.get('/gallery/add', ensureAuthenticated, async(req,res)=>{
//     res.render('addphotos',{ currentPage: 'none'})
//   });

//   app.post('/gallery/add', upload.single('imageFile'), async (req, res) => {
//     try {
//         const { Photoby, content, tag } = req.body;
//         const imageUrl = req.file.path; // Get the image URL from the uploaded file

//         // Create a new gallery item
//         const newGallery = new Gallery({
//             Photoby,
//             content,
//             imageUrl,
//             tag 
//         });
//         await newGallery.save();
//         res.redirect('/gallery');
//     } catch (err) {
//         console.error('Error creating gallery item:', err);
//         res.status(500).json({ error: 'Error creating gallery item' });
//     }
// });
// app.get('/gallery/:id/edit', ensureAuthenticated, async (req, res) => {
//     try {
//         const gallery = await Gallery.findById(req.params.id);
//         if (!gallery) {
//             return res.status(404).send('Blog not found');
//         }
//         res.render('editgallery', { gallery, currentPage: 'none'});
//     } catch (err) {
//         console.error('Error fetching gallery for edit:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// app.post('/gallery/:id/edit', upload.single('imageFile'), async (req, res) => {
//     const { Photoby, content, tag } = req.body; // Get data from the form
//     let imageUrl;

//     try {
//         // Find the existing gallery item
//         const galleryItem = await Gallery.findById(req.params.id);
//         if (!galleryItem) {
//             return res.status(404).send('Gallery item not found');
//         }

//         // Check if a new image was uploaded
//         if (req.file) {
//             // If a new image is uploaded, delete the previous image from Cloudinary
//             const publicId = galleryItem.imageUrl.split('/').slice(-2).join('/').split('.')[0]; // Extract public ID
//             console.log(`Attempting to delete image with public ID: ${publicId}`); // Log for debugging

//             const deletionResult = await cloudinary.uploader.destroy(publicId); // Delete the existing image
//             console.log('Deletion result:', deletionResult); // Log the result

//             // Get the new image URL from Cloudinary
//             imageUrl = req.file.path; 
//         } else {
//             // If no new image is uploaded, keep the existing image URL
//             imageUrl = galleryItem.imageUrl; 
//         }

//         // Update the gallery item with new data
//         const updateData = {
//             Photoby,
//             content,
//             tag,
//             imageUrl // Always set imageUrl, whether it’s updated or the same
//         };

//         const updatedGalleryItem = await Gallery.findByIdAndUpdate(
//             req.params.id,
//             updateData, // Fields to update
//             { new: true, runValidators: true } // Return the updated document and validate
//         );

//         if (!updatedGalleryItem) {
//             return res.status(404).send('Gallery item not found');
//         }

//         res.redirect('/gallery'); // Redirect to the list of gallery items
//     } catch (err) {
//         console.error('Error updating gallery data:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// // Route to handle the deletion
// app.delete('/gallery/:id', ensureAuthenticated, async (req, res) => {
//     try {
//         // Find the gallery item to get the image URL
//         const galleryItem = await Gallery.findById(req.params.id);
//         if (!galleryItem) {
//             return res.status(404).send('Gallery item not found');
//         }

//         // Extract the public ID from the image URL
//         const publicId = galleryItem.imageUrl.split('/').slice(-2).join('/').split('.')[0]; // Extract public ID
//         console.log(`Deleting image with public ID: ${publicId}`); // Log for debugging

//         // Delete the image from Cloudinary
//         const deletionResult = await cloudinary.uploader.destroy(publicId);
//         console.log('Deletion result:', deletionResult); // Log the result

//         // Delete the gallery item from the database
//         await Gallery.findByIdAndDelete(req.params.id);
        
//         res.redirect('/gallery'); // Redirect to the gallery list after deletion
//     } catch (err) {
//         console.error('Error deleting gallery:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });

//   app.get('/blogs', async (req, res) => {
//     try {
//         const blogsdetail = await Blog.find(); 
//         res.render('blogs', { blogsdetail, currentPage: 'blog' });
//     } catch (err) {
//         console.error('Error fetching blogs:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// app.get('/blogs/:id',async(req,res)=>{
//     const data = await Blog.findById(req.params.id);
//     res.render('blogDescription',{ data,currentPage: 'blog' })
// })

//   app.get('/addblogs', ensureAuthenticated, async(req,res)=>{
//     res.render('addblog',{ currentPage: 'blog' })
//   });

//   app.post('/addblogs', upload.single('imageFile'), async (req, res) => {
//     try {
//       const { title, content, author } = req.body;
  
//       // Ensure the image file was uploaded to Cloudinary
//       if (!req.file) {
//         return res.status(400).json({ error: 'No image file uploaded' });
//       }
  
//       // Get the Cloudinary image URL from the uploaded file
//       const imageUrl = req.file.path;
  
//       // Create a new blog post with the Cloudinary URL for the image
//       const newBlog = new Blog({
//         title,
//         content,
//         author,
//         imageUrl // Save the Cloudinary URL to the database
//       });
  
//       await newBlog.save();
  
//       res.redirect('/dashboard');
//     } catch (err) {
//       console.error('Error creating blog:', err);
//       res.status(500).json({ error: 'Error creating blog post' });
//     }
//   });

// // Route to render the edit form
// app.get('/blogs/:id/edit', ensureAuthenticated, async (req, res) => {
//     try {
//         const blog = await Blog.findById(req.params.id);
//         if (!blog) {
//             return res.status(404).send('Blog not found');
//         }
//         res.render('editblog', { blog, currentPage: 'blog' });
//     } catch (err) {
//         console.error('Error fetching blog for edit:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// // Route to handle the update request
// app.post('/blogs/:id/edit', upload.single('imageFile'), async (req, res) => {
//     const { title, content, author } = req.body; // Get data from the form
//     let imageUrl;

//     try {
//         // Find the existing blog post
//         const blog = await Blog.findById(req.params.id);
//         if (!blog) {
//             return res.status(404).send('Blog post not found');
//         }

//         // Check if a new image was uploaded
//         if (req.file) {
//             // If a new image is uploaded, delete the previous image from Cloudinary
//             const publicId = blog.imageUrl.split('/').slice(-2).join('/').split('.')[0]; // Extract public ID
//             console.log(`Attempting to delete image with public ID: ${publicId}`); // Log for debugging

//             const deletionResult = await cloudinary.uploader.destroy(publicId); // Delete the existing image
//             console.log('Deletion result:', deletionResult); // Log the result

//             // Get the new image URL from Cloudinary
//             imageUrl = req.file.path; 
//         } else {
//             // If no new image is uploaded, keep the existing image URL
//             imageUrl = blog.imageUrl; 
//         }

//         // Update the blog post with new data
//         const updateData = {
//             title,
//             content,
//             author,
//             imageUrl // Always set imageUrl, whether it’s updated or the same
//         };

//         const updatedBlog = await Blog.findByIdAndUpdate(
//             req.params.id,
//             updateData, // Fields to update
//             { new: true, runValidators: true } // Return the updated document and validate
//         );

//         if (!updatedBlog) {
//             return res.status(404).send('Blog post not found');
//         }

//         res.redirect('/dashboard'); // Redirect to the list of blog posts
//     } catch (err) {
//         console.error('Error updating blog:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });


// // Route to handle the deletion
// app.delete('/blogs/:id', ensureAuthenticated, async (req, res) => {
//     try {
//         // Find the blog post to get the image URL
//         const blogPost = await Blog.findById(req.params.id);
//         if (!blogPost) {
//             return res.status(404).send('Blog post not found');
//         }

//         // Extract the public ID from the image URL
//         const publicId = blogPost.imageUrl.split('/').slice(-2).join('/').split('.')[0]; // Extract public ID
//         console.log(`Deleting image with public ID: ${publicId}`); // Log for debugging

//         // Delete the image from Cloudinary
//         const deletionResult = await cloudinary.uploader.destroy(publicId);
//         console.log('Deletion result:', deletionResult); // Log the result

//         // Delete the blog post from the database
//         await Blog.findByIdAndDelete(req.params.id);
        
//         res.redirect('/dashboard'); // Redirect to the blog list after deletion
//     } catch (err) {
//         console.error('Error deleting blog:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });


// app.get('/notices', async (req, res) => {
//     try {
//         // Fetch all blog posts from the database
//         const noticesdetail = await Notice.find(); // This retrieves all blog documents

//         // Render the 'blogs' EJS template and pass the blog data
//         res.render('notices', { noticesdetail, currentPage: 'notice' });
//         } catch (err) {
//         console.error('Error fetching blogs:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });



// app.get('/addnotice', ensureAuthenticated, async(req,res)=>{
//     res.render('addnotice',{ currentPage: 'notice' });
// })

// app.post('/addnotice', upload.single('imageFile'), async (req, res) => {
//     try {
//         const { title } = req.body;

//       // Ensure the image file was uploaded to Cloudinary
//       if (!req.file) {
//         return res.status(400).json({ error: 'No image file uploaded' });
//       }
//       // Get the Cloudinary image URL from the uploaded file
//       const imageUrl = req.file.path;

//         // Create a new blog post
//         const newNotice = new Notice({
//             title,
//             imageUrl 
//         });

//         await newNotice.save();

//         res.redirect('/dashboard');
//     } catch (err) {
//         console.error('Error creating blog:', err);
//         res.status(500).json({ error: 'Error creating notice ' });
//     }
// });

// app.get('/notices/edit/:id', ensureAuthenticated, async (req, res) => {
//     try {
//         const notice = await Notice.findById(req.params.id); // Find the notice by ID
//         if (!notice) {
//             return res.status(404).send('Notice not found');
//         }
//         res.render('editnotice', { notice, currentPage: 'notice' }); // Render the edit form
//     } catch (err) {
//         console.error('Error fetching notice for edit:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// // Route to handle the update request
// app.post('/notices/edit/:id', upload.single('imageFile'), async (req, res) => {
//     const { title } = req.body; // Get the title from the form
//     let imageUrl;

//     try {
//         // Find the existing notice
//         const notice = await Notice.findById(req.params.id);
//         if (!notice) {
//             return res.status(404).send('Notice not found');
//         }

//         // Check if an image was uploaded
//         if (req.file) {
//             // If a new image is uploaded, delete the previous image from Cloudinary
//             const publicId = notice.imageUrl.split('/').slice(-2).join('/').split('.')[0]; // Extract public ID
//             console.log(`Attempting to delete image with public ID: ${publicId}`); // Log public ID for debugging

//             const deletionResult = await cloudinary.uploader.destroy(publicId); // Delete the existing image
//             console.log('Deletion result:', deletionResult); // Log deletion result

//             // Get the new image URL from Cloudinary
//             imageUrl = req.file.path; 
//         } else {
//             // If no new image is uploaded, keep the existing image URL
//             imageUrl = notice.imageUrl; 
//         }

//         // Update notice with new data
//         const updateData = {
//             title,
//             imageUrl // Always set imageUrl, whether it’s updated or the same
//         };

//         const updatedNotice = await Notice.findByIdAndUpdate(
//             req.params.id,
//             updateData, // Fields to update
//             { new: true, runValidators: true } // Return the updated document and validate
//         );

//         if (!updatedNotice) {
//             return res.status(404).send('Notice not found');
//         }

//         res.redirect('/dashboard'); // Redirect back to the notices list after update
//     } catch (err) {
//         console.error('Error updating notice:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// app.delete('/notice/:id', ensureAuthenticated, async (req, res) => {
//     try {
//         // Find the notice to get the image URL
//         const notice = await Notice.findById(req.params.id);
//         if (!notice) {
//             return res.status(404).send('Notice not found');
//         }

//         // Extract the public ID from the image URL
//         const publicId = notice.imageUrl.split('/').slice(-2).join('/').split('.')[0]; // Extract public ID
//         console.log(`Deleting image with public ID: ${publicId}`); // Log for debugging

//         // Delete the image from Cloudinary
//         const deletionResult = await cloudinary.uploader.destroy(publicId);
//         console.log('Deletion result:', deletionResult); // Log the result

//         // Delete the notice from the database
//         await Notice.findByIdAndDelete(req.params.id);
        
//         res.redirect('/dashboard'); // Redirect to the notices list after deletion
//     } catch (err) {
//         console.error('Error deleting notice:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// app.get('/login', (req, res) => {
//     res.render('login', { errorMessage: req.flash('error') });
// });

// app.post('/login', passport.authenticate('local', {
//     successRedirect: '/dashboard',
//     failureRedirect: '/login',
//     failureFlash: true
//   }));


//   app.get('/logout', (req, res) => {
//     // Destroy the session
//     req.session.destroy((err) => {
//       if (err) {
//         return res.status(500).json({ message: 'Logout failed', error: err });
//       }
//       res.redirect('/login'); // Redirect to login page
//     });
//   });


//   app.get('/dashboard',ensureAuthenticated, async (req, res) => {
//     try {
//         // Fetch data from MongoDB collections
//         const latestBlogs = await Blog.find();
//         const latestNotices = await Notice.find();
//         const gallery = await Gallery.find();  // Changed to match EJS variable
//         const upcomingEvents = await Event.find();
//         const hotelsList = await Hotel.find();

//         // Render the dashboard with the fetched data
//         res.render('dashboard', {
//             blogs: latestBlogs,
//             notices: latestNotices,
//             gallery: gallery, // Changed to match EJS variable
//             events: upcomingEvents,
//             hotels: hotelsList,
//             currentPage: 'dashboard'
//         });
//     } catch (err) {
//         console.error('Error fetching dashboard data:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });

app.listen(4000, () => {
    console.log(`CONNECTED TO DB AND SERVER START ON ${4000}`);
});