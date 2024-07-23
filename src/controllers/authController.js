const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const { getUserByEmail, createUser } = require("../models/UserModel");

const register = async (req, res) => {
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

    const existingEmail = await getUserByEmail(email);
    if (existingEmail.length > 0) {
      return res.status(401).json({
        message: "This email is allready used!",
        status: false,
      });
    }

    const salt = await bcrypt.genSaltSync(10); // Key
    const hashPassword = await bcrypt.hashSync(password, salt);
    await createUser(name, email, phone, hashPassword);

    return res.status(200).json({
      message: "Your account has been register successfully!",
      status: true,
    });
  } catch (error) {
    console.log("Inside Controller error", error);
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

// const login = async (req, res) => {
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

//     const existingEmail = await getUserByEmail(email);
//     if (existingEmail.length > 0) {
//       return res.status(401).json({
//         message: "This email is allready used!",
//         status: false,
//       });
//     }

//     const salt = await bcrypt.genSaltSync(10); // Key
//     const hashPassword = await bcrypt.hashSync(password, salt);

//     await createUser(name, email, phone, hashPassword);

//     return res.status(200).json({
//       message: "Your account has been register successfully!",
//       status: true,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//       status: false,
//     });
//   }
// };

module.exports = { register };
