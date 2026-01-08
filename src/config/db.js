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

const mysql = require("mysql2/promise");

const isProduction = process.env.NODE_ENV === "production";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: isProduction ? { rejectUnauthorized: false } : false,

  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 30000,
});

module.exports = pool;
