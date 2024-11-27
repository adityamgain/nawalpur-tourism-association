// // eventCron.js
// const cron = require('node-cron');
// const Event = require('../models/event'); // Make sure to adjust the path according to your project structure

// // Schedule a cron job to run every day at midnight (00:00) to delete past events
// const deletePastEvents = cron.schedule('0 0 * * *', async () => {
//     try {
//         const currentDate = new Date();
//         // Find and delete events where the date has passed
//         await Event.deleteMany({ date: { $lt: currentDate } });
//         console.log('Past events successfully deleted');
//     } catch (err) {
//         console.error('Error deleting past events:', err);
//     }
// });

// deletePastEvents.start();

// // Export the cron job function so it can be used elsewhere
// module.exports = deletePastEvents;

const cron = require('node-cron');
const Event = require('../models/event'); 

// Function to delete past events
const deletePastEventsTask = async () => {
    try {
        const currentDate = new Date();
        // Find and delete events where the date has passed
        const result = await Event.deleteMany({ date: { $lt: currentDate } });
        console.log(`Past events successfully deleted. Count: ${result.deletedCount}`);
    } catch (err) {
        console.error('Error deleting past events:', err);
    }
};

// Schedule a cron job to run every day at midnight 12 to delete past events
const deletePastEventsCron = cron.schedule('0 0 * * *', async () => {
    console.log('Running scheduled task: Deleting past events...');
    await deletePastEventsTask();
});

// Run the deletion when the server starts
(async () => {
    console.log('Server started. Running immediate past events deletion...');
    await deletePastEventsTask();
})();

// Export the cron job 
module.exports = deletePastEventsCron;

