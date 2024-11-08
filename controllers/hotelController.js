const Hotel = require('../models/hotel');

exports.getAllHotels = async (req, res) => {
    res.render('hotel',{ currentPage: 'hotel' });
};

exports.getHotelList = async (req, res) => {
    try {
        // Fetch all blog posts from the database
        const hotelslist = await Hotel.find().sort({ name: 1 });
        res.render('hotellist',{ hotelslist,currentPage: 'hotel' });
    } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.getAddHotelForm = (req, res) => {
    res.render('addhotellist', { currentPage: 'hotel' });
};

exports.addNewHotel = async (req, res) => {
    try {
        const { name, website, location } = req.body;
        // Create a new blog post
        const newHotel = new Hotel({
            name,
            website,
            location
        });

        await newHotel.save();

        res.redirect('/dashboard')
    } catch (err) {
        console.error('Error creating blog:', err);
        res.status(500).json({ error: 'Error creating blog post' });
    }
};

exports.getEditHotelForm = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).send('Blog not found');
        }
        res.render('edithotellist', { hotel, currentPage: 'hotel' });
    } catch (err) {
        console.error('Error fetching blog for edit:', err);
        res.status(500).send('Internal Server Error');
    }};

exports.updateHotel = async (req, res) => {
    const { name, website, location } = req.body;
    try {
        await Hotel.findByIdAndUpdate(req.params.id, { name, website, location }, { new: true });
        res.redirect('/dashboard'); // Redirect to the updated blog post
    } catch (err) {
        console.error('Error updating blog:', err);
        res.status(500).send('Internal Server Error');
    }};

exports.deleteHotel = async (req, res) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        res.redirect('/dashboard'); // Redirect to the blogs list after deletion
    } catch (err) {
        console.error('Error deleting blog:', err);
        res.status(500).send('Internal Server Error');
    }};
