const { Batch, BatchStudent } = require('../models');

async function migrate() {
    try {
        console.log('Syncing Batch tables...');

        await Batch.sync({ alter: true });
        console.log('Batch table synced.');

        await BatchStudent.sync({ alter: true });
        console.log('BatchStudent table synced.');

        console.log('Batch migration completed successfully.');
    } catch (error) {
        console.error('Batch migration failed:', error);
    } finally {
        process.exit();
    }
}

migrate();
