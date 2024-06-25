const express = require("express");
const router = express.Router();

const db = require("./db");

// welcome api
router.get("/", (req, res) => {
  return res.send("Welcome");
});

// Get all blogs
router.get("/blogs", (req, res) => {
  //   const { name } = req.query;
  db.query("SELECT * FROM `blogs`", (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    return res.json(results);
  });
});

// Add blog
router.post("/blogs/add", (req, res) => {
  const { title, description } = req.query;

  const sqlQuery = `INSERT INTO blogs (title, description) VALUES (?,?)`;
  db.query(sqlQuery, [title, description], (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    if (results) {
      const respose = {
        message: "Blog added successfully!",
        status: true,
      };
      return res.json(respose);
    }
  });
});

module.exports = router;
