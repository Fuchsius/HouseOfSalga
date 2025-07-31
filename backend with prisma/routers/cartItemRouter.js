const express = require('express');
const router = express.Router();
const {
    getCartItems,
    getCartItemById,
    createCartItem,
    updateCartItem,
    deleteCartItem
} = require('../controllers/cartItemController');

// Routes
router.get('/cart', getCartItems);
router.get('/cart/:id', getCartItemById);
router.post('/cart/add', createCartItem);
router.put('/cart/:id', updateCartItem);
router.delete('/cart/:id', deleteCartItem);

module.exports = router;
