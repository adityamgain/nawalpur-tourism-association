const mongoose = require('mongoose'); 
const Content = require('../models/content'); 

// Controller to handle fetching content by tag
exports.getContentByTag = async (req, res) => {
    const tag = req.params.tag; 
    const tagMap = {
        adventure: 'activity',
        nature: 'nature',
        culture: 'culture',
        wellness: 'wellness',
    };

    const templateMap = {
        adventure: 'adventure',
        nature: 'nature',
        culture: 'culture',
        wellness: 'wellbeing',
    };

    const tagCondition = tagMap[tag]; 
    const template = templateMap[tag]; 

    if (!tagCondition || !template) {
        return res.status(404).send('Page not found'); 
    }

    try {
        const contentdetail = await Content.find({ tag: tagCondition });
        res.render(template, { contentdetail, currentPage: 'things-to-do' });
    } catch (error) {
        console.error(`Error fetching content for tag "${tag}":`, error);
        res.status(500).send('Internal Server Error');
    }
};

// Controller to handle fetching content by ID
exports.getContentById = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid content ID');
    }
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
