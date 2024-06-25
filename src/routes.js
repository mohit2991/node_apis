const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const db = require("./db");

// welcome api
router.get("/", (req, res) => {
  return res.send("Welcome");
});

// Register/Signup api
router.post("/api/register", async (req, res) => {
  const { name, email, phone, password } = req.query;

  const salt = await bcrypt.genSaltSync(10); // Key
  const hashPassword = await bcrypt.hashSync(password, salt);

  const sqlQuery = `INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)`;
  db.query(
    sqlQuery,
    [name, email, phone, hashPassword],
    function (error, results) {
      if (error) {
        return res.status(500).send(error);
      }

      if (results) {
        const respose = {
          message: "Your account has been register successfully!",
          status: true,
        };

        return res.json(respose);
      }
    }
  );
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
