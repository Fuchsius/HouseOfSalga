const Review = require('../models/Review');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Helper function to validate product ID
const isValidProductId = (id) => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id) && 
         (new mongoose.Types.ObjectId(id)).toString() === id;
};

// ---------------------------
// Create a new review
// ---------------------------
exports.createReview = async (req, res) => {
  try {
    const { productId, user, rating, comment, title } = req.body;

    // Validate input
    if (!isValidProductId(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }
    if (!user || !rating || !title || !comment) {
      return res.status(400).json({ 
        success: false, 
        message: 'User, title, comment, and rating are required' 
      });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Create review
    const review = new Review({
      productId,
      user,
      title,
      rating,
      comment
    });

    await review.save();

    // Update product rating stats
    await updateProductRatingStats(productId);

    res.status(201).json({ 
      success: true, 
      data: review 
    });

  } catch (err) {
    console.error('Create Review Error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create review',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// ---------------------------
// Get all reviews for a product
// ---------------------------
exports.getReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!isValidProductId(productId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid product ID format' 
      });
    }

    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ 
      success: true, 
      data: reviews 
    });

  } catch (err) {
    console.error('Get Reviews Error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch reviews',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// ---------------------------
// Like/unlike a review
// ---------------------------
exports.toggleLike = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { user } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid review ID' 
      });
    }
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User is required' 
      });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        error: 'Review not found' 
      });
    }

    const userIndex = review.likes.indexOf(user);
    if (userIndex === -1) {
      review.likes.push(user);
    } else {
      review.likes.splice(userIndex, 1);
    }

    await review.save();
    res.json({ 
      success: true, 
      data: review 
    });

  } catch (err) {
    console.error('Toggle Like Error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to toggle like',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// ---------------------------
// Add reply to review
// ---------------------------
exports.addReply = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { user, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid review ID' 
      });
    }
    if (!user || !comment) {
      return res.status(400).json({ 
        success: false, 
        message: 'User and comment are required' 
      });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        error: 'Review not found' 
      });
    }

    review.replies.push({ user, comment });
    await review.save();

    res.status(201).json({ 
      success: true, 
      data: review 
    });

  } catch (err) {
    console.error('Add Reply Error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add reply',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// ---------------------------
// Get review summary
// ---------------------------
exports.getReviewSummary = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!isValidProductId(productId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid product ID format' 
      });
    }

    const reviews = await Review.find({ productId });

    const summary = {
      averageRating: 0,
      totalReviews: reviews.length,
      breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };

    if (reviews.length > 0) {
      const total = reviews.reduce((sum, r) => sum + r.rating, 0);
      summary.averageRating = parseFloat((total / reviews.length).toFixed(1));
      
      reviews.forEach(r => {
        const rating = Math.floor(r.rating); // Handle cases where rating might be a float
        if (rating >= 1 && rating <= 5) {
          summary.breakdown[rating] += 1;
        }
      });
    }

    res.json({ 
      success: true, 
      data: summary 
    });

  } catch (err) {
    console.error('Get Review Summary Error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch summary',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Helper function to update product rating stats
async function updateProductRatingStats(productId) {
  const reviews = await Review.find({ productId });
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  const average = reviews.length > 0 ? total / reviews.length : 0;

  await Product.findByIdAndUpdate(productId, {
    averageRating: parseFloat(average.toFixed(1)),
    reviewCount: reviews.length
  });
}
