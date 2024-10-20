const express = require('express');
const path=require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const methodOverride = require('method-override');

const Blog = require('./models/blog');
const Notice = require('./models/notice');
const Content = require('./models/content');
const Hotel = require('./models/hotel');
const Gallery = require('./models/gallery');
const Event = require('./models/event');

const app = express();


const hostname = 'localhost';
const port = 3000;
app.engine('ejs',ejsMate);
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

// Serve static files
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// MongoDB Atlas connection string
const uri = 'mongodb+srv://adityaamgain:aytida@amaltari.ql10o.mongodb.net/?retryWrites=true&w=majority&appName=amaltari';

mongoose.connect(uri)
.then(() => {
    console.log('Connected to MongoDB Atlas');
})
.catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
});


// Configure Multer to use Cloudinary storage
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'blog-images', // Optional: Create a folder in Cloudinary
//         allowed_formats: ['jpeg', 'png', 'jpg'],
//     }
// });

// const upload = multer({ storage: storage });

  app.get('/', async(req, res) => {
    const latestBlogs = await Blog.find().sort({ createdAt: -1 }).limit(3); // Get latest 3 blogs
    const latestNotices = await Notice.find().sort({ createdAt: -1 }).limit(6); // Get latest 6 notices
    const galleryphotos = await Gallery.aggregate([{ $sample: { size: 8 } }]);
    res.render('home', { blogs: latestBlogs, notices: latestNotices,photos:galleryphotos, currentPage: 'home' });
});


app.get('/about-us', (req, res) => {
  res.render('aboutus',{ currentPage: 'about' });
});

app.get('/adventure', async (req, res) => {
    const tagCondition = 'activity';
    const contentdetail = await Content.find({ tag: tagCondition });  
    res.render('adventure',{ contentdetail,currentPage: 'things-to-do' })
});
  
app.get('/nature',async (req, res) => {
    const tagCondition = 'nature';
    const contentdetail = await Content.find({ tag: tagCondition });  
    res.render('nature',{ contentdetail,currentPage: 'things-to-do' })
  });

app.get('/culture',async (req, res) => {
    const tagCondition = 'culture';
    const contentdetail = await Content.find({ tag: tagCondition });  
  res.render('culture',{ contentdetail,currentPage: 'things-to-do' })
});

app.get('/wellness',async (req, res) => {
    const tagCondition = 'wellness';
    const contentdetail = await Content.find({ tag: tagCondition });  
  res.render('wellbeing',{ contentdetail,currentPage: 'things-to-do' })
});   

app.get('/things-to-do/:id',async(req,res)=>{
    const id = req.params.id; 
    const data = await Content.findById(id);
    res.render('description',{ data,currentPage: 'things-to-do' })
})

app.get('/hotel', (req, res) => {
  res.render('hotel',{ currentPage: 'hotel' });
}); 

app.get('/hotel/list', async (req, res) => {
    try {
        // Fetch all blog posts from the database
        const hotelslist = await Hotel.find().sort({ name: 1 });
        res.render('hotellist',{ hotelslist,currentPage: 'hotel' });
    } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).send('Internal Server Error');
    }
  });


  app.get('/hotel/list/add',async(req,res)=>{
    res.render('addhotellist',{ currentPage: 'hotel' })
  });

  app.post('/hotel/list/add', async (req, res) => {
    try {
        const { name, website, location } = req.body;
        // Create a new blog post
        const newHotel = new Hotel({
            name,
            website,
            location
        });

        await newHotel.save();

        res.redirect('/hotel/list')
    } catch (err) {
        console.error('Error creating blog:', err);
        res.status(500).json({ error: 'Error creating blog post' });
    }
});

app.get('/hotel/list/:id/edit', async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).send('Blog not found');
        }
        res.render('edithotellist', { hotel, currentPage: 'hotel' });
    } catch (err) {
        console.error('Error fetching blog for edit:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle the update
app.post('/hotel/list/:id/edit', async (req, res) => {
    const { name, website, location } = req.body;
    try {
        await Hotel.findByIdAndUpdate(req.params.id, { name, website, location }, { new: true });
        res.redirect('/hotel/list'); // Redirect to the updated blog post
    } catch (err) {
        console.error('Error updating blog:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/hotel/list/delete/:id', async (req, res) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        res.redirect('/hotel/list'); // Redirect to the blogs list after deletion
    } catch (err) {
        console.error('Error deleting blog:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/gallery', async (req, res) => {
    try {
        const gallerydetail = await Gallery.find(); 
        res.render('gallery', { gallerydetail,currentPage: 'none'  });
    } catch (err) {
        console.error('Error fetching gallery:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/gallery/add',async(req,res)=>{
    res.render('addphotos',{ currentPage: 'none'})
  });

  app.post('/gallery/add', async (req, res) => {
    try {
        const { Photoby, content, imageUrl, tag } = req.body;
        // Create a new blog post
        const newGallery = new Gallery({
            Photoby,
            content,
            imageUrl,
            tag 
        });
        await newGallery.save();
        res.redirect('/gallery')
    } catch (err) {
        console.error('Error creating blog:', err);
        res.status(500).json({ error: 'Error creating blog post' });
    }
});

app.get('/gallery/:id/edit', async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.id);
        if (!gallery) {
            return res.status(404).send('Blog not found');
        }
        res.render('editgallery', { gallery, currentPage: 'none'});
    } catch (err) {
        console.error('Error fetching gallery for edit:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/gallery/:id/edit', async (req, res) => {
    const { Photoby, content, tag, imageUrl } = req.body;
    try {
        await Gallery.findByIdAndUpdate(req.params.id, { Photoby, content, tag, imageUrl }, { new: true });
        res.redirect(`/gallery`); // Redirect to the updated blog post
    } catch (err) {
        console.error('Error updating gallery data:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle the deletion
app.delete('/gallery/:id', async (req, res) => {
    try {
        await Gallery.findByIdAndDelete(req.params.id);
        res.redirect('/gallery'); // Redirect to the blogs list after deletion
    } catch (err) {
        console.error('Error deleting gallery:', err);
        res.status(500).send('Internal Server Error');
    }
});

  app.get('/blogs', async (req, res) => {
    try {
        const blogsdetail = await Blog.find(); 
        res.render('blogs', { blogsdetail, currentPage: 'blog' });
    } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/blogs/:id',async(req,res)=>{
    const data = await Blog.findById(req.params.id);
    res.render('blogDescription',{ data,currentPage: 'blog' })
})

  app.get('/addblogs',async(req,res)=>{
    res.render('addblog',{ currentPage: 'blog' })
  });

  app.post('/addblogs', async (req, res) => {
    try {
        const { title, content, author, imageUrl } = req.body;
        // Create a new blog post
        const newBlog = new Blog({
            title,
            content,
            author,
            imageUrl // Save the image URL to the database
        });

        await newBlog.save();

        res.redirect('/blogs')
    } catch (err) {
        console.error('Error creating blog:', err);
        res.status(500).json({ error: 'Error creating blog post' });
    }
});

// Route to render the edit form
app.get('/blogs/:id/edit', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        res.render('editblog', { blog });
    } catch (err) {
        console.error('Error fetching blog for edit:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle the update
app.post('/blogs/:id/edit', async (req, res) => {
    const { title, content, author, imageUrl } = req.body;
    try {
        await Blog.findByIdAndUpdate(req.params.id, { title, content, author, imageUrl }, { new: true });
        res.redirect(`/blogs`); // Redirect to the updated blog post
    } catch (err) {
        console.error('Error updating blog:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle the deletion
app.delete('/blogs/:id', async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.redirect('/blogs'); // Redirect to the blogs list after deletion
    } catch (err) {
        console.error('Error deleting blog:', err);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/notices', async (req, res) => {
    try {
        // Fetch all blog posts from the database
        const noticesdetail = await Notice.find(); // This retrieves all blog documents

        // Render the 'blogs' EJS template and pass the blog data
        res.render('notices', { noticesdetail, currentPage: 'notice' });
        } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/addnotice',async(req,res)=>{
    res.render('addnotice',{ currentPage: 'notice' });
})

app.post('/addnotice', async (req, res) => {
    try {
        const { title,imageUrl } = req.body;
        // Create a new blog post
        const newNotice = new Notice({
            title,
            imageUrl 
        });

        await newNotice.save();

        res.redirect('/notices');
    } catch (err) {
        console.error('Error creating blog:', err);
        res.status(500).json({ error: 'Error creating notice ' });
    }
});

app.get('/notices/edit/:id', async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id); // Find the notice by ID
        if (!notice) {
            return res.status(404).send('Notice not found');
        }
        res.render('editnotice', { notice }); // Render the edit form
    } catch (err) {
        console.error('Error fetching notice for edit:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle the update request
app.post('/notices/edit/:id', async (req, res) => {
    const { imageUrl, title } = req.body; // Data from the form
    try {
        const notice = await Notice.findByIdAndUpdate(
            req.params.id, 
            { imageUrl, title }, // Fields to update
            { new: true, runValidators: true } // Return the updated document and validate
        );
        if (!notice) {
            return res.status(404).send('Notice not found');
        }
        res.redirect('/notices'); // Redirect back to the notices list after update
    } catch (err) {
        console.error('Error updating notice:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/notice/:id', async (req, res) => {
    try {
        await Notice.findByIdAndDelete(req.params.id);
        res.redirect('/notices'); 
    } catch (err) {
        console.error('Error deleting notice:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(4000, () => {
    console.log(`CONNECTED TO DB AND SERVER START ON ${4000}`);
});