import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../Components/ProductCard/ProductCard';
import RatingStars from '../../Components/RatingStars/RatingStars';
import ProductTabs from '../../Components/ProductTabs/ProductTabs';
import Image3 from '../../Assets/Image3.png';
import Image2 from '../../Assets/Image2.png';
import Image1 from '../../Assets/Image1.png';
import R1 from '../../Assets/R1.png';
import R2 from '../../Assets/R2.png';
import R3 from '../../Assets/R3.png';
import R4 from '../../Assets/R4.png';
import visa from '../../Assets/1.png';
import pay from '../../Assets/2.png';
import './ProductReview.css';
import Footer from '../../Components/Footer/Footer'
import Header from '../../Components/Header/Header'

const ProductReview = () => {
  const navigate = useNavigate();
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

  const [allReviews, setAllReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
  axios.get(`http://localhost:5000/api/reviews/${product.id}`)
    .then((res) => {
      setAllReviews(res.data);
    })
    .catch((err) => {
      console.error("Failed to fetch reviews", err);
    });
}, []);


  const product = {
    id: 1,
    name: 'Noah Yellow overcoat',
    price: 5000.0,
    inStock: true,
    colors: ['orange', 'red', 'black'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    images: [Image3, Image2, Image1],
    description: 'This is a stylish Noah Yellow Overcoat designed with bold black and gray accents, adding a modern edge to its vibrant yellow base. Perfect for colder seasons, it blends functionality with high fashion.',
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
    { 
      id: 2, 
      name: 'Black Pins', 
      price: 2500.0, 
      rating: 5, 
      reviewCount: 121,
      image: Image1
    },
    { 
      id: 3, 
      name: 'Winter Jersey', 
      price: 500.0, 
      rating: 5, 
      reviewCount: 121,
      image: R1
    },
    { 
      id: 4, 
      name: 'Over Coat', 
      price: 10000.0, 
      rating: 5, 
      reviewCount: 121,
      image: R2
    },
    { 
      id: 5, 
      name: 'Summer dress', 
      price: 1500.0, 
      rating: 5, 
      reviewCount: 121,
      image: R3
    },
    { 
      id: 6, 
      name: 'Full kit', 
      price: 9000.0, 
      rating: 5, 
      reviewCount: 121,
      image: R4
    }
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

  const handleAddToCart = () => {
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
  };

  const handleBuyNow = () => {
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
  };

  const handleSubmitReview = async (e) => {
  e.preventDefault();
  if (!rating) {
    alert('Please select a star rating.');
    return;
  }

  try {
    const response = await axios.post('http://localhost:5000/api/reviews', {
      productId: product.id,
      user: "Anonymous", // or authenticated user
      title: reviewTitle,
      comment: reviewContent,
      rating: rating
    });

    setAllReviews(prev => [response.data, ...prev]); // add new review to top
    setRating(0);
    setReviewTitle('');
    setReviewContent('');
    alert('Thank you for your review!');
  } catch (err) {
    console.error("Failed to submit review", err);
    alert("Something went wrong while submitting the review.");
  }
};


  const handleLikeReview = (reviewId) => {
    setLikedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  return (
    <div>
      <Header />
    <div className="product-page">
      <div className="product-container">
        <div className="product-main">
          {/* Image Gallery Section */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="product-main-img"
                onError={(e) => {
                  console.error('Failed to load main image:', product.images[currentImageIndex]);
                }}
              />
              <button className="nav-button prev" onClick={prevImage}>
                <FaChevronLeft />
              </button>
              <button className="nav-button next" onClick={nextImage}>
                <FaChevronRight />
              </button>
            </div>
            <div className="image-dots-container">
              {product.images.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${currentImageIndex === index ? 'dot-active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="product-details">
            <div className="rating-favorite-container">
              <RatingStars rating={product.rating} size="large" />
              <button
                className="favorite-button-top"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                {isFavorite ? <FaHeart className="filled" /> : <FaRegHeart />}
              </button>
            </div>

            <h1 className="product-title">{product.name}</h1>
            <a href="#!" className="view-saves">
              View including taxes
            </a>

            <div className="price-stock">
              <span className="product-page-price">Rs. {product.price.toFixed(2)}</span>
              <span className="stock">{product.inStock ? 'In stock' : 'Out of stock'}</span>
            </div>

            <hr className="divider" />

            {/* Color Selector */}
            <div className="color-selector">
              <span className="color-label">Color: {selectedColor}</span>
              <div className="color-options">
                {product.colors.map((color) => (
                  <div
                    key={color}
                    className={`color-option-wrapper ${
                      selectedColor === color ? 'color-option-wrapper-selected' : ''
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    <div
                      className="color-option"
                      style={{
                        backgroundColor: color.toLowerCase()
                      }}
                      aria-label={color}
                    />
                  </div>
                ))}
              </div>
            </div>

            <hr className="divider" />

            {/* Size Selector */}
            <div className="size-selector">
              <span className="size-label">Size: {selectedSize}</span>
              <div className="size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'size-option-selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Control */}
            <div className="quantity-control">
              <div className="quantity-selector">
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
            
            {/* Action Buttons */}
            <div className="product-actions">
              <button className="add-to-cart" onClick={handleAddToCart}>
                <FaShoppingCart /> Add To Cart
              </button>
              <button className="buy-now" onClick={handleBuyNow}>
                <FaShoppingBag /> Buy Now
              </button>
            </div>

            {/* Secure Checkout */}
            <div className="secure-checkout">
              <div className="secure-icons">
                <img
                  src= {visa}
                  alt= "Secure Payment"
                />
                <img
                  src= {pay}
                  alt= "Secure Payment"
                />
              </div>
              <p>Guarantee safe & secure checkout</p>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="review-tabs-section">
          <ProductTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="review-tab-content">
            {activeTab === 'description' && (
              <div>
                <h2>Product Description</h2>
                <p>{product.description}</p>
              </div>
            )}
            {activeTab === 'review' && (
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
                            className={i < Math.floor(product.rating) ? "star filled" : "star"} 
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
                                className={i < item.stars ? "star filled" : "star"} 
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
                    
                    {(showAllReviews ? allReviews : allReviews.slice(0, 1)).map((review) => (

                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <div className="user-info">
                            <div className="user-initial">{review.user.charAt(0)}</div>
                            <div className="user-details">
                              <div className="user-name">{review.user}</div>
                              <div className="review-rating">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar 
                                    key={i} 
                                    className={i < review.rating ? "star filled" : "star"} 
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="review-date">{review.date}</div>
                        </div>
                        
                        <div className="review-body">
                          <h3>{review.title}</h3>
                          <p>{review.comment}</p>
                        </div>
                        
                        <div className="review-actions">
                          <button 
                            className={`like-btn ${likedReviews[review.id] ? 'liked' : ''}`}
                            onClick={() => handleLikeReview(review.id)}
                          >
                            <FaThumbsUp /> Like
                          </button>
                          <button className="reply-btn">
                            <FaReply /> Reply
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="view-all-reviews">
                     {!showAllReviews && allReviews.length > 1 && (
                      <button className="view-all-btn" onClick={() => setShowAllReviews(true)}>
                        View All Reviews
                      </button>
                     )}
                    </div>
                  </div>
                </div>

                <div className="add-review">
                  <h3>Write a Review</h3>
                  <form onSubmit={handleSubmitReview}>
                    <div className="form-group">
                      <label>What is it like to Product?</label>
                      <div className="rating-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={star <= rating ? "star selected" : "star"}
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
                        placeholder="Great Products"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="review">Review Content</label>
                      <textarea
                        id="review"
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        required
                        placeholder="It is a long established fact that a reader will be distracted..."
                      />
                    </div>

                    <button type="submit" className="submit-review-btn">
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
        <div className="review-recommended-products">
          <h2>Recommended</h2>
          <p className="review-subtitle">You might want to take a look at these.</p>
          <div className="review-product-grid">
            {recommendedProducts.map((p) => (
              <ProductCard key={p.id} product={p} variant="small" />
            ))}
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );

};

export default ProductReview;
