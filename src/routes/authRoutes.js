const express = require("express");
const router = express.Router();
const verifyToken = require("../utils/verifyToken");
const {
  register,
  updateProfile,
  forgotPassword,
  validateOtp,
} = require("../controllers/authController");
const { sendMessage, getMessages } = require("../controllers/chatController");

router.post("/api/register", register);
// router.post("/api/login", login);
router.post("/api/update-profile", verifyToken, updateProfile);
// router.get("/api/profile", profile);
router.post("/api/forgot-password", forgotPassword);
router.post("/api/validate-otp", validateOtp);

// Chat Routes
router.post("/api/send-message", verifyToken, sendMessage);
router.get("/api/get-messages", verifyToken, getMessages);

module.exports = router;
