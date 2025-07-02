const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path if needed

// 🔐 Register New User
const registerUser = async (req, res) => {
  const { email, username, mobile, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      username,
      mobile,
      password: hashedPassword,
    });

    await newUser.save();

    // ✅ Return username in response
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        username: newUser.username,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

// 🔐 Login User (Sign In)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
