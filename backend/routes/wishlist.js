const express = require('express');
const router = express.Router();
const WishlistItem = require('../models/WishlistItem');

// GET all wishlist items (NO authentication)
// router.get('/', async (req, res) => {
//     console.log("GET /api/wishlist called"); // Debug log
//     try {
//         const items = await WishlistItem.find().sort({ createdAt: -1 });
//         res.json(items);
//     } catch (error) {
//         console.error('Error fetching wishlist:', error);
//         res.status(500).json({ error: 'Failed to fetch wishlist' });
//     }
// });

router.post('/', async (req, res) => {
    try {
        const { title, image, price, rate } = req.body;
        if (!title || !image || !price) {
            return res.status(400).json({ message: 'Title, image, and price are required' });
        }
        const newItem = new WishlistItem({
            title,
            image,
            price: parseFloat(price),
            rate: rate || 0
        });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await WishlistItem.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Clear all items
router.delete('/', async (req, res) => {
    try {
        await WishlistItem.deleteMany({});
        res.json({ message: 'All items cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a PUT route to update a wishlist item by ID
router.put('/:id', async (req, res) => {
    try {
        const { title, image, price, rate } = req.body;
        const updatedItem = await WishlistItem.findByIdAndUpdate(
            req.params.id,
            { title, image, price, rate },
            { new: true, runValidators: true }
        );
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 
