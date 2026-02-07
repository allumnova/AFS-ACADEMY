console.log("Node is working");
console.log("CWD:", process.cwd());
const fs = require('fs');
console.log("app.js exists:", fs.existsSync('app.js'));
