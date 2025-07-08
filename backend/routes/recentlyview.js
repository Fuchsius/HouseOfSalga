const express = require('express');
const router = express.Router();
const RecentlyView = require('../models/recentlyview');

// GET all recently viewed items
router.get('/', async (req, res) => {
  try {
    const items = await RecentlyView.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a recently viewed item (for testing)
router.post('/', async (req, res) => {
  try {
    const newItem = new RecentlyView(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 