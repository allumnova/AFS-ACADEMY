const { sequelize } = require('../models');

async function testConnection() {
    try {
        console.log('Authenticating...');
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        console.log('Syncing...');
        await sequelize.sync({ force: false });
        console.log('All models were synchronized successfully.');

        process.exit(0);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

testConnection();
