const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Get all cart items
const getCartItems = async (req, res) => {
    try {
        const cartItems = await prisma.cartItem.findMany({
            include: {
                product: true,
                user: true
            }
        });
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving cart items' });
    }
};

// Get cart item by ID
const getCartItemById = async (req, res) => {
    const cartItemId = parseInt(req.params.id);

    try {
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: {
                product: true,
                user: true
            }
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        res.status(200).json(cartItem);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving cart item' });
    }
};

// Create new cart item
const createCartItem = async (req, res) => {
    const { cartId, userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    try {
        const cartItem = await prisma.cartItem.create({
            data: {
                cartId,
                userId,
                productId,
                quantity
            }
        });

        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ error: 'Error creating cart item' });
    }
};

// Update cart item
const updateCartItem = async (req, res) => {
    const cartItemId = parseInt(req.params.id);
    const { quantity } = req.body;

    try {
        const cartItem = await prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity }
        });

        res.status(200).json(cartItem);
    } catch (error) {
        res.status(500).json({ error: 'Error updating cart item' });
    }
};

// Delete cart item
const deleteCartItem = async (req, res) => {
    const cartItemId = parseInt(req.params.id);

    try {
        await prisma.cartItem.delete({
            where: { id: cartItemId }
        });

        res.status(200).json({ message: 'Cart item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting cart item' });
    }
};

module.exports = {
    getCartItems,
    getCartItemById,
    createCartItem,
    updateCartItem,
    deleteCartItem
};
