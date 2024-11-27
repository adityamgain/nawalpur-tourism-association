const express = require('express');
require('dotenv').config();
const path=require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
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

// engines
app.engine('ejs',ejsMate);
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');


// Serve static files
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.json());   
app.use(express.urlencoded({ extended: true }));  
app.use(session({
    secret: process.env.SESSION_KEY, 
    resave: false,
    saveUninitialized: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production' }
}));
app.use(flash());
  
// Passport Configuration
require('./utils/passportConfig')(passport);
app.use(passport.initialize());
app.use(passport.session());


// MongoDB Atlas connection 
const uri = process.env.DB;
mongoose.connect(uri)
    .then(() => {
        console.log("Database connected");
        deletePastEvents.start(); // Start the cron job after successful DB connection
    })
    .catch(err => {
        console.error("Error connecting to MongoDB Atlas:", err);
    });


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
  
// localhost 4000
app.listen(4000, () => {
    console.log(`CONNECTED TO DB AND SERVER START ON ${4000}`);
});