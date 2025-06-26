const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/auth.controller');

// Sign Up route (POST /api/auth/signup)
router.post('/signup', registerUser);

// Sign In route (POST /api/auth/signin)
router.post('/signin', loginUser);

module.exports = router;