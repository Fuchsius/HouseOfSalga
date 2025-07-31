const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Get all wishlist items
const getWishlistItems = async (req, res) => {
    try {
        const wishlistItems = await prisma.wishlistItem.findMany({
            include: {
                product: true,
                user: true
            }
        });
        res.status(200).json(wishlistItems);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving wishlist items' });
    }
};

// Get wishlist item by ID
const getWishlistItemById = async (req, res) => {
    const wishlistItemId = parseInt(req.params.id);

    try {
        const wishlistItem = await prisma.wishlistItem.findUnique({
            where: { id: wishlistItemId },
            include: {
                product: true,
                user: true
            }
        });

        if (!wishlistItem) {
            return res.status(404).json({ error: 'Wishlist item not found' });
        }

        res.status(200).json(wishlistItem);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving wishlist item' });
    }
};

// Create new wishlist item
const createWishlistItem = async (req, res) => {
    const { wishlistId, userId, productId } = req.body;

    if (!wishlistId || !userId || !productId) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    try {
        const wishlistItem = await prisma.wishlistItem.create({
            data: {
                wishlistId,
                userId,
                productId
            }
        });

        res.status(201).json(wishlistItem);
    } catch (error) {
        res.status(500).json({ error: 'Error creating wishlist item' });
    }
};

// Update wishlist item (if needed)
const updateWishlistItem = async (req, res) => {
    const wishlistItemId = parseInt(req.params.id);
    const { productId } = req.body;

    try {
        const wishlistItem = await prisma.wishlistItem.update({
            where: { id: wishlistItemId },
            data: { productId }
        });

        res.status(200).json(wishlistItem);
    } catch (error) {
        res.status(500).json({ error: 'Error updating wishlist item' });
    }
};

// Delete wishlist item
const deleteWishlistItem = async (req, res) => {
    const wishlistItemId = parseInt(req.params.id);

    try {
        await prisma.wishlistItem.delete({
            where: { id: wishlistItemId }
        });

        res.status(200).json({ message: 'Wishlist item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting wishlist item' });
    }
};

module.exports = {
    getWishlistItems,
    getWishlistItemById,
    createWishlistItem,
    updateWishlistItem,
    deleteWishlistItem
};
