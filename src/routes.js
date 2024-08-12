const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");

const db = require("./db");
const { validateEmail, validateName } = require("../src/utils/validation");
const verifyToken = require("./utils/verifyToken");

// welcome api
router.get("/", (req, res) => {
  return res.send("Welcome");
});

// Register/Signup api
router.post("/api/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const schema = joi.object({
      name: joi.string().required(),
      email: joi.string().email().required(),
      phone: joi.number().min(10).required(),
      password: joi.string().min(8).max(20).required(),
    });

    const validateRespone = schema.validate({ name, email, phone, password });
    if (validateRespone.error) {
      return res.status(500).json({
        status: false,
        message: validateRespone.error.details[0].message,
      });
    }

    // const nameError = validateName(name);
    // if (!nameError) {
    //   const respose = {
    //     message: "Name is required.",
    //     status: false,
    //   };
    //   return res.status(401).json(respose);
    // }

    // if (name.length > 20) {
    //   const respose = {
    //     message: "Name length should be less then 20 char",
    //     status: false,
    //   };
    //   return res.status(401).json(respose);
    // }

    // const emailError = await validateEmail(email);
    // if (emailError == null) {
    //   const respose = {
    //     message: "Invalid Email format!",
    //     status: false,
    //   };
    //   return res.status(401).json(respose);
    // }

    db.query(
      `SELECT * FROM users where email='${email}'`,
      async (error, results) => {
        if (error) {
          return res.status(500).send(error);
        }
        if (results) {
          if (results.length > 0) {
            const respose = {
              message: "This email is allready used!",
              status: false,
            };
            return res.status(401).json(respose);
          }
        }
      }
    );

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
  } catch (error) {
    const respose = {
      message: error.message,
      status: false,
    };
    return res.status(401).json(respose);
  }
});

// Login API
router.post("/api/login", async function (req, res) {
  const { email, password } = req.body;

  const sqlQuery = `SELECT * FROM users where email='${email}'`;
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

router.get("/api/profile", verifyToken, async (req, res) => {
  const { email } = req.user;

  db.query("SELECT * FROM `users` where email=?", [email], (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }

    const obj = results[0];
    obj.profile =
      obj.profile == null ? null : "http://localhost:8000/" + obj.profile;

    return res.json(obj);
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
