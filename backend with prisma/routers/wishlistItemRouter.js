const express = require('express');
const router = express.Router();

const {
    getWishlistItems,
    getWishlistItemById,
    createWishlistItem,
    updateWishlistItem,
    deleteWishlistItem
} = require('../controllers/wishlistItemController');

// Routes
router.get('/wishlist', getWishlistItems);
router.get('/wishlist/:id', getWishlistItemById);
router.post('/wishlist/create', createWishlistItem);
router.put('/wishlist/update/:id', updateWishlistItem);
router.delete('/wishlist/delete/:id', deleteWishlistItem);

module.exports = router;
