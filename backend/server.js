// fashion-backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/reviewRoutes');
const checkoutRoutes = require('./routes/checkout');


const app = express();
app.use(cors());
app.use(express.json());

// Simple root route (optional)
app.get('/', (req, res) => {
  res.send('Fashion Backend API is running');
});

// Connect to MongoDB with current recommended options
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/checkout', checkoutRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

