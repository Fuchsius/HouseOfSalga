const express = require('express');
const router = express.Router();
const orderItemController = require('../controllers/orderItemController');

router.get('/order_items/:orderId', orderItemController.getOrderItems);
router.post('/order_items', orderItemController.addOrderItem);
router.put('/order_items/:id', orderItemController.updateOrderItem);
router.delete('/order_items/:id', orderItemController.deleteOrderItem);

module.exports = router;