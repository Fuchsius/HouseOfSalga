const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  googleAuthUser
} = require('../controllers/auth.controller');

// 📝 Register (Sign Up)
router.post('/signup', registerUser);

// 🔐 Login (Sign In)
router.post('/signin', loginUser);

// 🔗 Google Login
router.post('/google', googleAuthUser);

module.exports = router;
