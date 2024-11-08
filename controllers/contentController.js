const Content = require('../models/content'); // Ensure your Content model is imported

exports.getAdventureContent = async (req, res) => {
    const tagCondition = 'activity';
    try {
        const contentdetail = await Content.find({ tag: tagCondition });
        res.render('adventure', { contentdetail, currentPage: 'things-to-do' });
    } catch (error) {
        console.error('Error fetching adventure content:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getNatureContent = async (req, res) => {
    const tagCondition = 'nature';
    try {
        const contentdetail = await Content.find({ tag: tagCondition });
        res.render('nature', { contentdetail, currentPage: 'things-to-do' });
    } catch (error) {
        console.error('Error fetching nature content:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getCultureContent = async (req, res) => {
    const tagCondition = 'culture';
    try {
        const contentdetail = await Content.find({ tag: tagCondition });
        res.render('culture', { contentdetail, currentPage: 'things-to-do' });
    } catch (error) {
        console.error('Error fetching culture content:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getWellnessContent = async (req, res) => {
    const tagCondition = 'wellness';
    try {
        const contentdetail = await Content.find({ tag: tagCondition });
        res.render('wellbeing', { contentdetail, currentPage: 'things-to-do' });
    } catch (error) {
        console.error('Error fetching wellness content:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getContentById = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Content.findById(id);
        if (!data) {
            return res.status(404).send('Content not found');
        }
        res.render('description', { data, currentPage: 'things-to-do' });
    } catch (error) {
        console.error('Error fetching content by ID:', error);
        res.status(500).send('Internal Server Error');
    }
};
