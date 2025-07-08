import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FaShoppingCart,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaRegHeart,
  FaShoppingBag,
  FaThumbsUp,
  FaReply,
  FaStar,
  FaExclamationTriangle,
  FaAngleDown,
  FaAngleUp
} from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../../Components/ProductCard/ProductCard';
import RatingStars from '../../Components/RatingStars/RatingStars';
import ProductTabs from '../../Components/ProductTabs/ProductTabs';
import Footer from '../../Components/Footer/Footer';
import Header from '../../Components/Header/Header';
import styles from './ProductReview.module.css';
import axios from 'axios';
import useRecommendedProducts from '../../hooks/useRecommendedProducts';

const ProductReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for product data
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for product interactions
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});

  // State for reviews
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Use the recommended products hook
  const { 
    recommended: recommendedProducts, 
    loading: recommendedLoading, 
    error: recommendedError 
  } = useRecommendedProducts(product?._id);

  // Memoized product details
  const productDetails = useMemo(() => {
    if (!product) return null;
    return {
      id: product._id,
      name: product.name,
      price: product.price,
      inStock: product.inStock,
      averageRating: product.averageRating,
      images: product.images || [],
      colors: product.colors || [],
      sizes: product.sizes || []
    };
  }, [product]);

  // Handle image load
  const handleImageLoad = useCallback((index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
    setIsImageLoading(false);
  }, []);

  // Handle image error
  const handleImageError = useCallback((index) => {
    setLoadedImages(prev => ({ ...prev, [index]: false }));
    setIsImageLoading(false);
  }, []);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        if (response.data.success && response.data.data) {
          const productData = response.data.data;
          setProduct(productData);
          setSelectedSize(productData.sizes?.[0] || null);
          setSelectedColor(productData.colors?.[0] || null);
          
          // Preload images
          const initialLoaded = {};
          productData.images?.forEach((_, idx) => {
            initialLoaded[idx] = false;
          });
          setLoadedImages(initialLoaded);
        } else {
          setError(response.data.message || 'Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.message || err.message || 'Error fetching product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch reviews data
  useEffect(() => {
    if (!product?._id) return;

    const fetchReviews = async () => {
      try {
        const [reviewsRes, summaryRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/reviews/${product._id}`),
          axios.get(`http://localhost:5000/api/reviews/summary/${product._id}`)
        ]);
        
        if (reviewsRes.data.success) {
          setReviews(reviewsRes.data.data);
        }
        if (summaryRes.data.success) {
          setReviewSummary(summaryRes.data.data);
        }
        
        // Update product rating if changed
        if (summaryRes.data.success && summaryRes.data.data.averageRating !== product.averageRating) {
          setProduct(prev => ({
            ...prev,
            averageRating: summaryRes.data.data.averageRating
          }));
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    fetchReviews();
  }, [product?._id, product?.averageRating]);

  // Image navigation handler
  const handleImageNavigation = useCallback((direction) => {
    setIsImageLoading(true);
    setCurrentImageIndex(prev => {
      const lastIndex = productDetails?.images?.length - 1 || 0;
      const newIndex = direction === 'next' 
        ? prev === lastIndex ? 0 : prev + 1
        : prev === 0 ? lastIndex : prev - 1;
      
      if (loadedImages[newIndex]) {
        setIsImageLoading(false);
      }
      
      return newIndex;
    });
  }, [productDetails?.images?.length, loadedImages]);

  // Add to cart handler
  const handleAddToCart = useCallback(() => {
    if (!product) return;
    navigate('/cart', {
      state: {
        product: {
          ...product,
          selectedSize,
          selectedColor,
          quantity
        }
      }
    });
  }, [product, selectedSize, selectedColor, quantity, navigate]);

  // Buy now handler
  const handleBuyNow = useCallback(() => {
    if (!product) return;
    navigate('/checkout', {
      state: {
        product: {
          ...product,
          selectedSize,
          selectedColor,
          quantity
        }
      }
    });
  }, [product, selectedSize, selectedColor, quantity, navigate]);

  // Product click handler
  const handleProductClick = useCallback((clickedProduct) => {
    navigate(`/product/${clickedProduct._id || clickedProduct.id}`);
  }, [navigate]);

  // Submit review handler
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating) {
      alert('Please select a star rating.');
      return;
    }
    if (!reviewTitle || !reviewContent) {
      alert('Please fill in both title and content.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const username = localStorage.getItem('username') || 'Guest User';
      
      const response = await axios.post('http://localhost:5000/api/reviews', {
        productId: product._id,
        user: username,
        rating,
        title: reviewTitle,
        comment: reviewContent
      });
      
      if (response.data.success) {
        // Refresh reviews
        const [reviewsRes, summaryRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/reviews/${product._id}`),
          axios.get(`http://localhost:5000/api/reviews/summary/${product._id}`)
        ]);
        
        if (reviewsRes.data.success) {
          setReviews(reviewsRes.data.data);
        }
        if (summaryRes.data.success) {
          setReviewSummary(summaryRes.data.data);
          setProduct(prev => ({
            ...prev,
            averageRating: summaryRes.data.data.averageRating
          }));
        }
        
        // Reset form
        setRating(0);
        setReviewTitle('');
        setReviewContent('');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(`Failed to submit review: ${err.response?.data?.message || 'Please try again.'}`);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Like review handler
  const handleLikeReview = async (reviewId) => {
    try {
      const username = localStorage.getItem('username') || 'Guest User';
      
      const response = await axios.post(`http://localhost:5000/api/reviews/like/${reviewId}`, {
        user: username
      });
      
      if (response.data.success) {
        // Update the specific review
        setReviews(prev => prev.map(review => {
          if (review._id === reviewId) {
            return response.data.data;
          }
          return review;
        }));
      }
    } catch (err) {
      console.error('Error liking review:', err);
    }
  };

  // Add reply handler
  const handleAddReply = async (reviewId) => {
    try {
      const username = localStorage.getItem('username') || 'Guest User';
      
      const response = await axios.post(`http://localhost:5000/api/reviews/reply/${reviewId}`, {
        user: username,
        comment: replyContent
      });
      
      if (response.data.success) {
        // Update the specific review
        setReviews(prev => prev.map(review => {
          if (review._id === reviewId) {
            return response.data.data;
          }
          return review;
        }));
        setReplyingTo(null);
        setReplyContent('');
      }
    } catch (err) {
      console.error('Error adding reply:', err);
    }
  };

  // Format date helper
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // Calculate rating distribution
  const ratingDistribution = useMemo(() => {
    const total = reviewSummary.totalReviews || 1;
    return {
      5: Math.round((reviewSummary.breakdown[5] / total) * 100),
      4: Math.round((reviewSummary.breakdown[4] / total) * 100),
      3: Math.round((reviewSummary.breakdown[3] / total) * 100),
      2: Math.round((reviewSummary.breakdown[2] / total) * 100),
      1: Math.round((reviewSummary.breakdown[1] / total) * 100)
    };
  }, [reviewSummary]);

  // Toggle show all reviews
  const toggleShowAllReviews = useCallback(() => {
    setShowAllReviews(prev => !prev);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className={styles.loadingOverlay}>
        <Header />
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading product details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className={styles.errorContainer}>
        <Header />
        <div className={styles.errorContent}>
          <FaExclamationTriangle className={styles.errorIcon} />
          <h2>Product Not Found</h2>
          <p>We couldn't find the product you're looking for.</p>
          <button 
            className={styles.continueShopping}
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.productPage}>
        <div className={styles.productContainer}>
          <div className={styles.productMain}>
            {/* Product images section */}
            <div className={styles.productImages}>
              <div className={styles.mainImage}>
                {isImageLoading && !loadedImages[currentImageIndex] && (
                  <div className={styles.imageLoadingOverlay}>
                    <div className={styles.loadingSpinner}></div>
                  </div>
                )}
                {productDetails.images.length > 0 ? (
                  <img
                    src={productDetails.images[currentImageIndex]}
                    alt={productDetails.name}
                    className={`${styles.productMainImg} ${
                      isImageLoading && !loadedImages[currentImageIndex] ? styles.hidden : ''
                    }`}
                    onLoad={() => handleImageLoad(currentImageIndex)}
                    onError={() => handleImageError(currentImageIndex)}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    No Images Available
                  </div>
                )}
                {productDetails.images.length > 1 && (
                  <>
                    <button
                      className={`${styles.navButton} ${styles.prev}`}
                      onClick={() => handleImageNavigation('prev')}
                      disabled={isImageLoading}
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      className={`${styles.navButton} ${styles.next}`}
                      onClick={() => handleImageNavigation('next')}
                      disabled={isImageLoading}
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}
              </div>

              {productDetails.images.length > 1 && (
                <div className={styles.imageDotsContainer}>
                  {productDetails.images.map((_, index) => (
                    <span
                      key={index}
                      className={`${styles.dot} ${currentImageIndex === index ? styles.active : ''}`}
                      onClick={() => {
                        if (index !== currentImageIndex) {
                          setIsImageLoading(!loadedImages[index]);
                          setCurrentImageIndex(index);
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product details section */}
            <div className={styles.productDetails}>
              <div className={styles.ratingFavoriteContainer}>
                <RatingStars 
                  rating={productDetails.averageRating || 0} 
                  size="large" 
                />
                <button
                  className={styles.favoriteButtonTop}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  {isFavorite ? <FaHeart className={styles.filled} /> : <FaRegHeart />}
                </button>
              </div>

              <h1 className={styles.productTitle}>{productDetails.name}</h1>
              <a href="#!" className={styles.viewSaves}>
                View including taxes
              </a>

              <div className={styles.priceStock}>
                <span className={styles.price}>Rs. {productDetails.price?.toFixed(2)}</span>
                <span className={styles.stock}>
                  {productDetails.inStock ? 'In stock' : 'Out of stock'}
                </span>
              </div>

              <hr className={styles.divider} />

              {productDetails.colors.length > 0 && (
                <>
                  <div className={styles.colorSelector}>
                    <span className={styles.colorLabel}>Color: {selectedColor}</span>
                    <div className={styles.colorOptions}>
                      {productDetails.colors.map((color) => (
                        <div
                          key={color}
                          className={`${styles.colorOptionWrapper} ${
                            selectedColor === color ? styles.selected : ''
                          }`}
                          onClick={() => setSelectedColor(color)}
                          style={{
                            borderColor: selectedColor === color ? color.toLowerCase() : undefined
                          }}
                        >
                          <div
                            className={styles.colorOption}
                            style={{
                              backgroundColor: color.toLowerCase(),
                              borderColor: color.toLowerCase()
                            }}
                            aria-label={color}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <hr className={styles.divider} />
                </>
              )}

              {productDetails.sizes.length > 0 && (
                <div className={styles.sizeSelector}>
                  <span>Size: {selectedSize}</span>
                  <div className={styles.sizeOptions}>
                    {productDetails.sizes.map((size) => (
                      <button
                        key={size}
                        className={`${styles.sizeOption} ${
                          selectedSize === size ? styles.sizeOptionSelected : ''
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.quantityControl}>
                <div className={styles.quantitySelector}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className={styles.productActions}>
                <button
                  className={styles.addToCart}
                  onClick={handleAddToCart}
                  disabled={!productDetails.inStock || isImageLoading}
                >
                  <FaShoppingCart /> Add To Cart
                </button>
                <button
                  className={styles.buyNow}
                  onClick={handleBuyNow}
                  disabled={!productDetails.inStock || isImageLoading}
                >
                  <FaShoppingBag /> Buy Now
                </button>
              </div>

              <div className={styles.secureCheckout}>
                <div className={styles.secureIcons}>
                  <img
                    src="/images/product/trustbag.png"
                    alt="Secure Payment"
                    loading="lazy"
                  />
                </div>
                <p>Guarantee safe & secure checkout</p>
              </div>
            </div>
          </div>

          {/* Tabs section */}
          <div className={styles.tabsSection}>
            <ProductTabs
              activeTab="review"
              productId={productDetails.id}
            />
            
            <div className={styles.tabContent}>
              <section className={styles.reviewContent}>
                <div className={styles.feedbackSummary}>
                  <div className={styles.averageRatingBox}>
                    <div className={styles.averageRating}>{reviewSummary.averageRating.toFixed(1)}</div>
                    <div className={styles.ratingStars1}>
                      <RatingStars 
                        rating={reviewSummary.averageRating} 
                        size="medium" 
                      />
                    </div>
                    <div className={styles.ratingLabel}>Product Rating</div>
                    <div className={styles.totalReviews}>{reviewSummary.totalReviews} reviews</div>
                  </div>
                  <div className={styles.ratingDistribution}>
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className={styles.ratingRow}>
                        <div className={styles.ratingBar}>
                          <div
                            style={{ width: `${ratingDistribution[stars]}%` }}
                            className={styles.ratingProgress}
                          ></div>
                        </div>
                        <div className={styles.stars}>
                          <RatingStars 
                            rating={stars} 
                            size="small" 
                          />
                        </div>
                        <div className={styles.percentage}>{ratingDistribution[stars]}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.reviewsSection}>
                  <h3>Reviews ({reviewSummary.totalReviews})</h3>
                  {reviews.length === 0 ? (
                    <p className={styles.noReviews}>No reviews yet. Be the first to review!</p>
                  ) : (
                    <>
                      {reviews.slice(0, showAllReviews ? reviews.length : 1).map((review) => (
                        <article key={review._id} className={styles.reviewCard}>
                          <div className={styles.reviewHeader}>
                            <div className={styles.userInitial}>{review.user?.charAt(0) || 'U'}</div>
                            <div className={styles.userDetails}>
                              <div className={styles.userNameAndRating}>
                                <span className={styles.userName}>{review.user || 'Anonymous'}</span>
                                <div className={styles.reviewRating}>
                                  <RatingStars 
                                    rating={review.rating} 
                                    size="small" 
                                  />
                                </div>
                              </div>
                              <div className={styles.reviewDate}>{formatDate(review.createdAt)}</div>
                            </div>
                          </div>
                          <div className={styles.reviewBody}>
                            <h4>{review.title}</h4>
                            <p>{review.comment}</p>
                          </div>
                          <div className={styles.reviewActions}>
                            <button
                              className={`${styles.likeBtn} ${
                                review.likes?.includes(localStorage.getItem('username')) ? styles.liked : ''
                              }`}
                              onClick={() => handleLikeReview(review._id)}
                            >
                              <FaThumbsUp /> Like ({review.likes?.length || 0})
                            </button>
                            <button
                              className={styles.replyBtn}
                              onClick={() => setReplyingTo(replyingTo === review._id ? null : review._id)}
                            >
                              <FaReply /> Reply
                            </button>
                          </div>

                          {replyingTo === review._id && (
                            <div className={styles.replyForm}>
                              <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write your reply..."
                                rows="3"
                              />
                              <div className={styles.replyButtons}>
                                <button
                                  className={styles.cancelReply}
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyContent('');
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  className={styles.submitReply}
                                  onClick={() => handleAddReply(review._id)}
                                  disabled={!replyContent}
                                >
                                  Submit Reply
                                </button>
                              </div>
                            </div>
                          )}

                          {review.replies?.length > 0 && (
                            <div className={styles.repliesContainer}>
                              {review.replies.map((reply, index) => (
                                <div key={index} className={styles.replyItem}>
                                  <div className={styles.replyHeader}>
                                    <div className={styles.replyUserInitial}>{reply.user?.charAt(0) || 'U'}</div>
                                    <div className={styles.replyUserDetails}>
                                      <div className={styles.replyUserName}>{reply.user || 'Anonymous'}</div>
                                      <div className={styles.replyDate}>{formatDate(reply.createdAt)}</div>
                                    </div>
                                  </div>
                                  <div className={styles.replyContent}>{reply.comment}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </article>
                      ))}

                      {reviews.length > 1 && (
                        <button className={styles.viewMoreButton} onClick={toggleShowAllReviews}>
                          {showAllReviews ? (
                            <>
                              <FaAngleUp /> View Less
                            </>
                          ) : (
                            <>
                              <FaAngleDown /> View More ({reviews.length - 1} more reviews)
                            </>
                          )}
                        </button>
                      )}
                    </>
                  )}
                </div>

                <div className={styles.addReview}>
                  <h3>Write a Review</h3>
                  <form onSubmit={handleSubmitReview}>
                    <div className={styles.formGroup}>
                      <label>How would you rate this product?</label>
                      <div className={styles.ratingInput}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={star <= rating ? `${styles.star} ${styles.selected}` : styles.star}
                            onClick={() => setRating(star)}
                          />
                        ))}
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="review-title">Review Title</label>
                      <input
                        id="review-title"
                        type="text"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        required
                        placeholder="Great product!"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="review">Review Content</label>
                      <textarea
                        id="review"
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        required
                        placeholder="Share your experience..."
                        rows="5"
                      />
                    </div>
                    <button
                      type="submit"
                      className={styles.submitReviewBtn}
                      disabled={!reviewTitle || !reviewContent || rating === 0 || isSubmittingReview}
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              </section>
            </div>
          </div>

          {/* Recommended products section */}
          <div className={styles.recommendedProducts}>
            <h2>Recommended</h2>
            <p className={styles.subtitle}>You might want to take a look at these.</p>
            {recommendedLoading ? (
              <div className={styles.loadingRecommendations}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading recommendations...</p>
              </div>
            ) : recommendedError ? (
              <p className={styles.errorText}>{recommendedError}</p>
            ) : recommendedProducts.length > 0 ? (
              <div className={styles.productGrid}>
                {recommendedProducts.map((item) => (
                  <ProductCard
                    key={item._id}
                    product={item}
                    variant="small"
                    onClick={() => handleProductClick(item)}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.noRecommendations}>
                <p>No recommended products available at this time</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductReview;
