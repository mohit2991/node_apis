const mysql = require("mysql");

// Create DB Connection
const db = mysql.createConnection({
  host: "db4free.net",
  user: "nodejsdb_2023",
  password: "nodejsdb_2023",
  database: "nodejsdb_2023",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database", err);
    return;
  }
  console.log("Connected to databse successfully!");
});

module.exports = db;
