const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const util = require("util");

const db = require("./db");
const { validateEmail, validateName } = require("./utils/validation");
const verifyToken = require("./utils/verifyToken");

db.query = util.promisify(db.query);

// welcome api
router.get("/", (req, res) => {
  return res.send("Welcome");
});

// Register/Signup api
// router.post("/api/register", async (req, res) => {
//   const { name, email, phone, password } = req.body;

//   try {
//     const schema = joi.object({
//       name: joi.string().required(),
//       email: joi.string().email().required(),
//       phone: joi.number().min(10).required(),
//       password: joi.string().min(8).max(20).required(),
//     });

//     const validateRespone = schema.validate({ name, email, phone, password });
//     if (validateRespone.error) {
//       return res.status(500).json({
//         status: false,
//         message: validateRespone.error.details[0].message,
//       });
//     }

//     const existingEmail = await db.query(`SELECT * FROM users WHERE email=?`, [
//       email,
//     ], ());
//     if (existingEmail.length > 0) {
//       return res.status(401).json({
//         message: "This email is allready used!",
//         status: false,
//       });
//     }

//     const salt = await bcrypt.genSaltSync(10); // Key
//     const hashPassword = await bcrypt.hashSync(password, salt);

//     const sqlQuery = `INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)`;
//     db.query(
//       sqlQuery,
//       [name, email, phone, hashPassword],
//       function (error, results) {
//         if (error) {
//           return res.status(500).send(error);
//         }

//         if (results) {
//           const respose = {
//             message: "Your account has been register successfully!",
//             status: true,
//           };

//           return res.json(respose);
//         }
//       }
//     );
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//       status: false,
//     });
//   }
// });

// Login API
router.post("/api/login", async function (req, res) {
  const { email, password } = req.body;

  const sqlQuery = await `SELECT * FROM users where email='${email}'`;
  db.query(sqlQuery, async (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }

    if (results) {
      if (results.length === 0) {
        // []
        const respose = {
          message: "Invalid login details!",
          status: false,
        };
        return res.status(401).json(respose);
      }

      const hashPassword = results[0].password;
      const match = await bcrypt.compare(password, hashPassword);

      if (match) {
        const payload = { email };
        const secretKey = process.env.SECRET_KEY;
        console.log(">>>>>>>>>>>>>> mohit secretKey", secretKey);
        const accessToken = await jwt.sign(payload, secretKey);
        const response = {
          token: accessToken,
          message: "Login Successfully!",
          status: true,
        };
        return res.json(response);
      } else {
        const respose = {
          message: "Invalid login details!",
          status: false,
        };
        return res.status(401).json(respose);
      }
    }
  });
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
