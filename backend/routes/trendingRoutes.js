const express = require('express');
const router = express.Router();
const trendingController = require('../controllers/trendingController');

// GET /api/trending
router.get('/', trendingController.getAllTrendingProducts);

// POST /api/trending
router.post('/', trendingController.createTrendingProduct);

module.exports = router;
