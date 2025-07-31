const express = require('express');
const router = express.Router();
const {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    getOrdersByUser
} = require('../controllers/orderController');

// Order routes
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderById);
router.get('/orders/user/:userId', getOrdersByUser);
router.post('/orders', createOrder);
router.put('/orders/:id', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

module.exports = router;