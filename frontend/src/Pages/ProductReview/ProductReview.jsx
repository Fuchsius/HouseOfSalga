import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaStar,
  FaThumbsUp,
  FaReply,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import './ProductReview.css';

const ProductReview = ({ product }) => {
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [allReviews, setAllReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [likedReviews, setLikedReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState({});
  const [submittingReply, setSubmittingReply] = useState(false);

  const ratingDistribution = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 10 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 5 }
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5000/api/reviews/${product.id}`);
        setAllReviews(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch reviews', err);
        setError('Failed to load reviews');
        setLoading(false);
      }
    };

    fetchReviews();
  }, [product.id]);

  const handleLikeReview = (reviewId) => {
    setLikedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating) {
      alert('Please select a rating');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/reviews', {
        productId: product.id,
        user: 'Anonymous',
        title: reviewTitle,
        comment: reviewContent,
        rating: rating
      });

      setAllReviews((prev) => [response.data, ...prev]);
      setRating(0);
      setReviewTitle('');
      setReviewContent('');
      alert('Review submitted!');
    } catch (err) {
      console.error('Review submission failed', err);
      alert('Error submitting review');
    }
  };

  const handleReplySubmit = async (reviewId) => {
    if (!replyContent.trim()) {
      alert('Please enter a reply');
      return;
    }

    setSubmittingReply(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/reviews/reply/${reviewId}`, {
        user: 'Anonymous',
        comment: replyContent,
        reviewId: reviewId
      });

      setAllReviews(prevReviews =>
        prevReviews.map(review =>
          review._id === reviewId
            ? {
                ...review,
                replies: [...(review.replies || []), response.data]
              }
            : review
        )
      );

      setReplyContent('');
      setReplyingTo(null);
      setSubmittingReply(false);
    } catch (err) {
      console.error('Reply submission failed', err);
      alert('Error submitting reply');
      setSubmittingReply(false);
    }
  };

  const toggleReplies = (reviewId) => {
    setShowReplies(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleReplyClick = (reviewId) => {
    setReplyingTo(replyingTo === reviewId ? null : reviewId);
    setReplyContent('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="review-content">
      <div className="customer-feedback-container">
        <div className="feedback-header">
          <h3>Customers Feedback</h3>
        </div>

        <div className="feedback-summary">
          <div className="average-rating-box">
            <div className="average-rating">{product.rating.toFixed(1)}</div>
            <div className="rating-stars-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < Math.floor(product.rating) ? 'star filled' : 'star'}
                />
              ))}
            </div>
            <div className="rating-label">Product Rating</div>
          </div>

          <div className="rating-distribution">
            {ratingDistribution.map((item, index) => (
              <div key={index} className="rating-row">
                <div className="rating-bar">
                  <div
                    className="rating-progress"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < item.stars ? 'star filled' : 'star'}
                    />
                  ))}
                </div>
                <div className="percentage">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="reviews-section">
          <h3>Reviews</h3>

          {loading && <p>Loading reviews...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && allReviews.length === 0 && <p>No reviews yet.</p>}

          {!loading && allReviews.length > 0 &&
            (showAllReviews ? allReviews : allReviews.slice(0, 1)).map((review) => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <div className="user-info">
                    <div className="user-initial">{review.user.charAt(0)}</div>
                    <div className="user-details">
                      <div className="user-name">{review.user}</div>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < review.rating ? 'star filled' : 'star'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="review-date">{formatDate(review.date)}</div>
                </div>

                <div className="review-body">
                  <h3>{review.title}</h3>
                  <p>{review.comment}</p>
                </div>

                <div className="review-actions">
                  <button
                    className={`like-btn ${likedReviews[review._id] ? 'liked' : ''}`}
                    onClick={() => handleLikeReview(review._id)}
                  >
                    <FaThumbsUp /> Like
                  </button>
                  <button className="reply-btn" onClick={() => handleReplyClick(review._id)}>
                    <FaReply /> Reply
                  </button>

                  {review.replies?.length > 0 && (
                    <button className="show-replies-btn" onClick={() => toggleReplies(review._id)}>
                      {showReplies[review._id] ? <FaChevronUp /> : <FaChevronDown />}
                      {review.replies.length} {review.replies.length === 1 ? 'Reply' : 'Replies'}
                    </button>
                  )}
                </div>

                {replyingTo === review._id && (
                  <div className="reply-form">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write your reply..."
                      className="reply-textarea"
                    />
                    <div className="reply-form-actions">
                      <button
                        onClick={() => handleReplySubmit(review._id)}
                        disabled={submittingReply}
                        className="submit-reply-btn"
                      >
                        {submittingReply ? 'Submitting...' : 'Submit Reply'}
                      </button>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="cancel-reply-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {review.replies?.length > 0 && showReplies[review._id] && (
                  <div className="replies-container">
                    {review.replies.map((reply) => (
                      <div key={reply._id} className="reply-card">
                        <div className="reply-header">
                          <div className="user-info">
                            <div className="user-initial">{reply.user.charAt(0)}</div>
                            <div className="user-details">
                              <div className="user-name">{reply.user}</div>
                            </div>
                          </div>
                          <div className="reply-date">{formatDate(reply.date)}</div>
                        </div>
                        <div className="reply-body">
                          <p>{reply.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

          {!loading && allReviews.length > 1 && !showAllReviews && (
            <div className="view-all-reviews">
              <button className="view-all-btn" onClick={() => setShowAllReviews(true)}>
                View All Reviews
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="add-review">
        <h3>Write a Review</h3>
        <form onSubmit={handleSubmitReview}>
          <div className="form-group">
            <label>How do you rate this product?</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={star <= rating ? 'star selected' : 'star'}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="review-title">Review Title</label>
            <input
              id="review-title"
              type="text"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              required
              placeholder="Great Product!"
            />
          </div>

          <div className="form-group">
            <label htmlFor="review">Review Content</label>
            <textarea
              id="review"
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              required
              placeholder="Share your experience..."
            />
          </div>

          <button type="submit" className="submit-review-btn">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductReview;
