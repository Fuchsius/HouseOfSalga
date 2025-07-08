const User = require('../models/User');
const Product = require('../models/Product');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.wishlist || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
};

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { productId } = req.params;
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    res.json({ message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
    await user.save();
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
}; 
