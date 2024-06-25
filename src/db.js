const mysql = require("mysql2");

// Create DB Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bookmyshow",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database", err);
    return;
  }
  console.log("Connected to databse successfully!");
});

module.exports = db;
