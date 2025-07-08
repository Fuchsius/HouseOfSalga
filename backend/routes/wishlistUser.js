const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlist.controller');
const { authenticateJWT } = require('../controllers/auth.controller');

router.get('/', getWishlist);
router.post('/:productId', authenticateJWT, addToWishlist);
router.delete('/:productId', authenticateJWT, removeFromWishlist);

module.exports = router; 