const Review = require('../models/Review');

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { productId, user, title, comment, rating } = req.body;
    const newReview = new Review({ productId, user, title, comment, rating });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all reviews for a specific product
exports.getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
