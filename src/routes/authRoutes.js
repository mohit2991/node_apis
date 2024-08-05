const express = require("express");
const router = express.Router();
const { register, updateProfile } = require("../controllers/authController");
const verifyToken = require("../utils/verifyToken");

router.post("/api/register", register);
// router.post("/api/login", login);
router.post("/api/update-profile", verifyToken, updateProfile);
// router.get("/api/profile", profile);
module.exports = router;
