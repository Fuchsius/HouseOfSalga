const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviewsByProduct
} = require('../controllers/reviewController');

// POST /api/reviews
router.post('/', createReview);

// GET /api/reviews/:productId
router.get('/:productId', getReviewsByProduct);

module.exports = router;
