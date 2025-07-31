const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const orderItemController = {
    // Get items for a specific order
    getOrderItems: async (req, res) => {
        const orderId = parseInt(req.params.orderId);
        try {
            const items = await prisma.orderItem.findMany({
                where: { orderId },
                include: {
                    product: true
                }
            });
            res.json(items);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch order items' });
        }
    },

    // Add item to order
    addOrderItem: async (req, res) => {
        const { orderId, productId, quantity, price } = req.body;
        console.log(orderId);
        try {
            const orderItem = await prisma.orderItem.create({
                data: {
                    orderId,
                    productId,
                    quantity,
                    price
                }
            });
            res.status(201).json(orderItem);
        } catch (error) {
            res.status(500).json({ error: 'Failed to add order item' });
        }
    },

    // Update order item quantity
    updateOrderItem: async (req, res) => {
        const { id } = req.params;
        const { quantity } = req.body;
        try {
            const updatedItem = await prisma.orderItem.update({
                where: { id: parseInt(id) },
                data: { quantity }
            });
            res.json(updatedItem);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update order item' });
        }
    },

    // Delete item from order
    deleteOrderItem: async (req, res) => {
        const { id } = req.params;
        try {
            await prisma.orderItem.delete({
                where: { id: parseInt(id) }
            });
            res.json({ message: 'Order item deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete order item' });
        }
    }
};

module.exports = orderItemController;