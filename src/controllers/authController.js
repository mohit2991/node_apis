const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const path = require("path");
const fs = require("fs");
const {
  getUserByEmail,
  createUser,
  updateUser,
  updateOtp,
  getCustomerSupportUserList,
} = require("../models/UserModel");
// const transporter = require("../utils/emailHanddler");

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

const updateProfile = async (req, res) => {
  const { name, profile } = req.body;
  const { email } = req.user;

  const { filename, data } = profile;

  try {
    const buffer = Buffer.from(data, "base64");
    const filePath = path.join(__dirname, "..", "public", filename);

    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        return res.status(500).json({
          message: "Error while updating profile!",
          status: false,
        });
      }
    });

    // Model function
    await updateUser(name, filename, email);

    return res.status(200).json({
      message: "Profile updated successfully",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const schema = joi.object({
      email: joi.string().email().required(),
    });

    const validateRespone = schema.validate({ email });
    if (validateRespone.error) {
      return res.status(500).json({
        status: false,
        message: validateRespone.error.details[0].message,
      });
    }

    const existingEmail = await getUserByEmail(email);
    if (existingEmail.length === 0) {
      return res.status(401).json({
        message: "Invaild email address!",
        status: false,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    // save OTP
    await updateOtp(email, otp);

    // Send OTP Email
    const emailData = {
      from: {
        name: "Book My Show",
        address: "node@bookmyshow.com",
      },
      to: [email],
      subject: "Password Reset OTP",
      html: `<div style="color:red">Your otp is<b>${otp}</b><div>`,
      attactments: [
        {
          filename: "test.jpg",
          path: path.join(__dirname, "..", "public", "15849704207951.jpg"),
          contentType: "image/jpeg/jpg",
        },
      ],
    };

    const sendMail = () => {
      try {
        // transporter.sendMail(emailData);

        return res.status(200).json({
          message: `OTP sent to ${email} successfully`,
          status: true,
        });
      } catch (error) {
        console.log(">>>>>>>> error", error);
      }
    };

    sendMail();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

const validateOtp = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    const schema = joi.object({
      email: joi.string().email().required(),
      otp: joi.string().required(),
      password: joi.string().required(),
    });

    const validateRespone = schema.validate({ email, otp, password });
    if (validateRespone.error) {
      return res.status(500).json({
        status: false,
        message: validateRespone.error.details[0].message,
      });
    }

    const existingEmail = await getUserByEmail(email);
    if (existingEmail.length === 0) {
      return res.status(401).json({
        message: "Invaild email address!",
        status: false,
      });
    }

    if (otp !== existingEmail[0].otp) {
      return res.status(401).json({
        message: "Invalid otp!",
        status: false,
      });
    }

    const salt = await bcrypt.genSaltSync(10); // Key
    const hashPassword = await bcrypt.hashSync(password, salt);

    // save OTP
    await updateUser(null, null, email, null, hashPassword);

    return res.status(200).json({
      message: `Your password reset successfully`,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

const getCustomerCareUserList = async (req, res) => {
  try {
    const userList = await getCustomerSupportUserList();
    if (userList.length === 0) {
      return res.status(401).json({
        message: "No customer support active",
        status: false,
      });
    }

    return res.status(200).json({
      message: `Customer support list!`,
      status: true,
      userList: userList,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

module.exports = {
  register,
  updateProfile,
  forgotPassword,
  validateOtp,
  getCustomerCareUserList,
};
