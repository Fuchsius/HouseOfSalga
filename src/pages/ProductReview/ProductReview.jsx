import React, { useState } from 'react';
import {
  FaShoppingCart,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaShoppingBag,
  FaRegHeart,
  FaThumbsUp,
  FaReply,
  FaStar
} from 'react-icons/fa';
import ProductCard from '../../components/ProductCard/ProductCard';
import RatingStars from '../../components/RatingStars/RatingStars';
import ProductTabs from '../../components/ProductTabs/ProductTabs';
import styles from './ProductReview.module.css';

const ProductReview = () => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('red');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('review');
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [likedReviews, setLikedReviews] = useState({});

  const product = {
    id: 1,
    name: 'Noah Yellow overcoat',
    price: 5000.0,
    inStock: true,
    colors: ['orange', 'red', 'Black'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    images: [
      '/images/product/1.png',
      '/images/products/1-alt1.jpg',
      '/images/products/1-alt2.jpg'
    ],
    description: 'This is a stylish Noah Yellow Overcoat designed with bold black and gray accents.',
    rating: 4.8,
    reviewCount: 121,
    returnsPolicy: 'Returns accepted within 30 days of purchase.'
  };

  const reviews = [
    {
      id: 1,
      user: 'Nicola Cage',
      title: 'Great Product',
      rating: 5,
      date: '0 Days ago',
      comment: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour'
    },
    {
      id: 2,
      user: 'John Doe',
      title: 'Great Product',
      rating: 4,
      date: '2023-09-28',
      comment: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
    }
  ];

  const ratingDistribution = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 10 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 2 }
  ];

  const recommendedProducts = [
    { id: 2, name: 'Black Pins', price: 2500.0, rating: 5, reviewCount: 121 },
    { id: 3, name: 'Winter Arves', price: 500.0, rating: 5, reviewCount: 121 },
    { id: 4, name: 'Over Coat', price: 10000.0, rating: 5, reviewCount: 121 },
    { id: 5, name: 'Summer Arves', price: 1500.0, rating: 5, reviewCount: 121 },
    { id: 6, name: 'Full kit', price: 9000.0, rating: 5, reviewCount: 121 }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!rating) {
      alert('Please select a star rating.');
      return;
    }
    console.log({ rating, reviewTitle, reviewContent });
    setRating(0);
    setReviewTitle('');
    setReviewContent('');
    alert('Thank you for your review!');
  };

  const handleLikeReview = (reviewId) => {
    setLikedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  return (
    <div className={styles.productPage}>
      <div className={styles.productContainer}>
        <div className={styles.productMain}>
          {/* Image Gallery */}
          <div className={styles.productImages}>
            <div className={styles.mainImage}>
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className={styles.productMainImg}
              />
              <button className={`${styles.navButton} ${styles.prev}`} onClick={prevImage}>
                <FaChevronLeft />
              </button>
              <button className={`${styles.navButton} ${styles.next}`} onClick={nextImage}>
                <FaChevronRight />
              </button>
            </div>
            <div className={styles.imageDotsContainer}>
              {product.images.map((_, index) => (
                <span
                  key={index}
                  className={`${styles.dot} ${currentImageIndex === index ? styles.active : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className={styles.productDetails}>
            <div className={styles.ratingFavoriteContainer}>
              <RatingStars rating={product.rating} size="large" />
              <button
                className={styles.favoriteButtonTop}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                {isFavorite ? <FaHeart className={styles.filled} /> : <FaRegHeart />}
              </button>
            </div>

            <h1 className={styles.productTitle}>{product.name}</h1>
            <a href="#!" className={styles.viewSaves}>
              View including saves
            </a>

            <div className={styles.priceStock}>
              <span className={styles.price}>Rs. {product.price.toFixed(2)}</span>
              <span className={styles.stock}>{product.inStock ? 'In stock' : 'Out of stock'}</span>
            </div>

            <hr className={styles.divider} />

            {/* Color Selector */}
            <div className={styles.colorSelector}>
              <div className={styles.colorOptions}>
                {product.colors.map((color) => (
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

            {/* Size Selector */}
            <div className={styles.sizeSelector}>
              <span>Size: {selectedSize}</span>
              <div className={styles.sizeOptions}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`${styles.sizeOption} ${selectedSize === size ? styles.sizeOptionSelected : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.quantityControl}>
              <div className={styles.quantitySelector}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
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
              <button className={styles.addToCart}>
                <FaShoppingCart /> Add To Cart
              </button>
              <button className={styles.buyNow}>
                <FaShoppingBag className={styles.buyNowBagIcon} /> Buy Now
              </button>
            </div>

            <div className={styles.secureCheckout}>
              <div className={styles.secureIcons}>
                <img
                  src="/images/product/trustbag.png"
                  alt="Secure Payment"
                />
              </div>
              <p>Guarantee safe & secure checkout</p>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className={styles.tabsSection}>
          <ProductTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className={styles.tabContent}>
            {activeTab === 'description' && (
              <div>
                <h2>Product Description</h2>
                <p>{product.description}</p>
              </div>
            )}
            {activeTab === 'review' && (
              <div className={styles.reviewContent}>
                <div className={styles.customerFeedbackContainer}>
                  <div className={styles.feedbackHeader}>
                    <h3>Customers Feedback</h3>
                  </div>
                  
                  <div className={styles.feedbackSummary}>
                    <div className={styles.averageRatingBox}>
                      <div className={styles.averageRating}>{product.rating.toFixed(1)}</div>
                      <div className={styles.ratingStars1}>
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={i < Math.floor(product.rating) ? `${styles.star} ${styles.filled}` : styles.star} 
                          />
                        ))}
                      </div>
                      <div className={styles.ratingLabel}>Product Rating</div>
                    </div>
                    
                    <div className={styles.ratingDistribution}>
                      {ratingDistribution.map((item, index) => (
                        <div key={index} className={styles.ratingRow}>
                          <div className={styles.ratingBar}>
                            <div 
                              className={styles.ratingProgress} 
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <div className={styles.stars}>
                            {[...Array(5)].map((_, i) => (
                              <FaStar 
                                key={i} 
                                className={i < item.stars ? `${styles.star} ${styles.filled}` : styles.star} 
                              />
                            ))}
                          </div>
                          <div className={styles.percentage}>{item.percentage}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className={styles.reviewsSection}>
                    <h3>Reviews</h3>
                    
                    {reviews.map((review) => (
                      <div key={review.id} className={styles.reviewCard}>
                        <div className={styles.reviewHeader}>
                          <div className={styles.userInfo}>
                            <div className={styles.userInitial}>{review.user.charAt(0)}</div>
                            <div className={styles.userDetails}>
                              <div className={styles.userName}>{review.user}</div>
                              <div className={styles.reviewDate}>{review.date}</div>
                            </div>
                          </div>
                          <div className={styles.reviewRating}>
                            {[...Array(5)].map((_, i) => (
                              <FaStar 
                                key={i} 
                                className={i < review.rating ? `${styles.star} ${styles.filled}` : styles.star} 
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div className={styles.reviewBody}>
                          <p>{review.comment}</p>
                        </div>
                        
                        <div className={styles.reviewActions}>
                          <button 
                            className={`${styles.likeBtn} ${likedReviews[review.id] ? styles.liked : ''}`}
                            onClick={() => handleLikeReview(review.id)}
                          >
                            <FaThumbsUp /> Like
                          </button>
                          <button className={styles.replyBtn}>
                            <FaReply /> Reply
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div className={styles.viewAllReviews}>
                      <button className={styles.viewAllBtn}>View All Reviews</button>
                    </div>
                  </div>
                </div>

                <div className={styles.addReview}>
                  <h3>Write a Review</h3>
                  <form onSubmit={handleSubmitReview}>
                    <div className={styles.formGroup}>
                      <label>What is it like to Product?</label>
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
                        placeholder="Great Products"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="review">Review Content</label>
                      <textarea
                        id="review"
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        required
                        placeholder="It is a long established fact that a reader will be distracted..."
                      />
                    </div>

                    <button type="submit" className={styles.submitReviewBtn}>
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>
            )}
            {activeTab === 'returns' && (
              <div>
                <h2>Returns & Exchanges</h2>
                <p>{product.returnsPolicy}</p>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Products */}
        <div className={styles.recommendedProducts}>
          <h3>Recommended</h3>
          <p className={styles.subtitle}>You might want to take a look at these.</p>
          <div className={styles.productGrid}>
            {recommendedProducts.map((p) => (
              <ProductCard key={p.id} product={p} variant="small" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReview;