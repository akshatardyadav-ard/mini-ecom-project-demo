// require("dotenv").config();
// const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Database connection failed:", err);
//     return;
//   }
//   console.log("MySQL connected successfully");
// });

// module.exports = db;

require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  ssl: {
    rejectUnauthorized: false,
  },

  connectTimeout: 20000,
});

// Optional: test connection once (SAFE)
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Pool connected");
    connection.release();
  } catch (err) {
    console.error("❌ MySQL Pool connection failed:", err.message);
  }
})();

module.exports = pool;
