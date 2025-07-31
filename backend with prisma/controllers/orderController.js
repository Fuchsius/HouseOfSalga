const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Get all orders
const getOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: true,
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving orders' });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    const orderId = parseInt(req.params.id);
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving order' });
    }
};

// Get orders by user ID

const getOrdersByUser = async (req, res) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error retrieving user orders:', error);
        res.status(500).json({ error: 'Error retrieving user orders' });
    }
};

// Create new order
const createOrder = async (req, res) => {
    const { userId, orderItems, discount, deliveryFee, taxRate } = req.body;

    if (!userId || !orderItems || !orderItems.length) {
        return res.status(400).json({ error: 'User ID and order items are required' });
    }

    try {
        const order = await prisma.order.create({
            data: {
                userId,
                status: 'pending',
                discount,
                deliveryFee,
                taxRate,
                orderItems: {
                    create: orderItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: {
                orderItems: true
            }
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error creating order' });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    try {
        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error updating order status' });
    }
};

// Delete order
const deleteOrder = async (req, res) => {
    const orderId = parseInt(req.params.id);

    try {
        // First delete all related order items
        await prisma.orderItem.deleteMany({
            where: { orderId: orderId }
        });

        // Then delete the order
        await prisma.order.delete({
            where: { id: orderId }
        });

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting order' });
    }
};

module.exports = {
    getOrders,
    getOrderById,
    getOrdersByUser,
    createOrder,
    updateOrderStatus,
    deleteOrder
};