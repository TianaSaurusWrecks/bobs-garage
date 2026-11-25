// server/config/db.js
const mysql = require("mysql2/promise"); // import the MySQL driver with Promise support
require("dotenv").config(); // load teh settings from the .env file

const pool = mysql.createPool({ // create a pool of reusable db connections
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        minVersion: "TLSv1.2"
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;