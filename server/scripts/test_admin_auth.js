const axios = require('axios');

async function testAdminAccess() {
    try {
        // 1. Login as Admin
        console.log("Logging in as admin...");
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@afs.com',
            password: 'password123'
        });

        const token = loginRes.data.token;
        console.log("Login successful. Token:", token.substring(0, 20) + "...");
        console.log("User Role:", loginRes.data.user.role);

        // 2. Access Admin Stats
        console.log("\nAccessing Admin Stats...");
        const statsRes = await axios.get('http://localhost:5000/api/admin/stats', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Access Granted!");
        console.log("Stats:", statsRes.data);

    } catch (error) {
        console.error("Test Failed:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testAdminAccess();
