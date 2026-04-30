const express = require("express");
const { login, register } = require("../controllers/authController");
const { authLimiter } = require("../middleware/rateLimiters");
const router = express.Router();

router.post("/login", authLimiter, login);
router.post("/register", register);

module.exports = router;
