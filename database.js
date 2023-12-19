require('dotenv').config();
const mysql = require('mysql2');
const fs = require('fs');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    ca: fs.readFileSync(__dirname + process.env.CRT),
  },
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

module.exports.getRecords = async function (table) {
  // returns an array of records matching the sql query, or an empty array if no records are found
  const [rows] = await promisePool.query(
    `SELECT * FROM ${table} where processedDate is null`
  );
  return rows;
};