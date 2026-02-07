const { Review } = require('../models');

async function migrate() {
    try {
        console.log('Syncing Review table for status column...');
        await Review.sync({ alter: true });
        console.log('Review table updated successfully.');
    } catch (error) {
        console.error('Review migration failed:', error);
    } finally {
        process.exit();
    }
}

migrate();
