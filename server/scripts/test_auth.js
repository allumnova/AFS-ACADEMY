const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

async function testAuth() {
    const email = `teststudent_${Date.now()}@example.com`;
    const password = 'password123';

    try {
        // 1. Register
        console.log(`Testing Registration with ${email}...`);
        const registerRes = await axios.post(`${API_URL}/register`, {
            name: 'Test Student',
            email: email,
            password: password,
            role: 'student'
        });
        console.log('Registration Success:', registerRes.data);

        // 2. Login
        console.log('\nTesting Login...');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: email,
            password: password
        });
        console.log('Login Success:', loginRes.data);

        if (loginRes.data.token) {
            console.log('\nToken received successfully.');
        } else {
            console.error('\nToken missing in login response.');
            process.exit(1);
        }

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

testAuth();
