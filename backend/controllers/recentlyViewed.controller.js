const User = require('../models/User');
const Product = require('../models/Product');

// Get current user's recently viewed products
exports.getRecentlyViewed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('recentlyViewed');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.recentlyViewed || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recently viewed products' });
  }
};

// Add a product to current user's recently viewed
exports.addRecentlyViewed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { productId } = req.params;
    // Remove if already exists
    user.recentlyViewed = user.recentlyViewed.filter(
      (id) => id.toString() !== productId
    );
    // Add to front
    user.recentlyViewed.unshift(productId);
    // Limit to 10 items
    user.recentlyViewed = user.recentlyViewed.slice(0, 10);
    await user.save();
    res.json({ message: 'Product added to recently viewed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add recently viewed product' });
  }
}; 