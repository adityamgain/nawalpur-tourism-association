// controllers/homeController.js
const Blog = require('../models/blog');
const Notice = require('../models/notice');
const Gallery = require('../models/gallery');
const Event = require('../models/event');

module.exports.renderHomePage = async (req, res) => {
  try {
    const latestBlogs = await Blog.find().sort({ createdAt: -1 }).limit(3); // Get latest 3 blogs
    const latestNotices = await Notice.find().sort({ createdAt: -1 }).limit(6); // Get latest 6 notices
    const galleryphotos = await Gallery.aggregate([{ $sample: { size: 8 } }]); // Get 8 random photos
    const upcomingevents = await Event.find().sort({ date: 1 }).limit(3); // Get 3 upcoming events sorted by date

    res.render('home', { 
      blogs: latestBlogs, 
      notices: latestNotices, 
      photos: galleryphotos, 
      events: upcomingevents, 
      currentPage: 'home' 
    });
  } catch (err) {
    console.error('Error fetching home page data:', err);
    res.status(500).send('Internal Server Error');
  }
};
