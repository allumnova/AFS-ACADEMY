const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function listTables() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        const [rows] = await connection.query('SHOW TABLES');
        console.log('Tables in database:', process.env.DB_NAME);
        console.table(rows);

        await connection.end();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

listTables();
