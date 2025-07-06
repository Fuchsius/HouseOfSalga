import React, { useState, useEffect } from 'react';
import {
  FaShoppingCart,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaShoppingBag,
  FaRegHeart,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Component Imports
import ProductCard from '../../Components/ProductCard/ProductCard';
import RatingStars from '../../Components/RatingStars/RatingStars';
import ProductTabs from '../../Components/ProductTabs/ProductTabs';
import Footer from '../../Components/Footer/Footer';
import Header from '../../Components/Header/Header';
import useRecommendedProducts from '../../hooks/useRecommendedProducts';

// Styles
import styles from './ProductReturns.module.css';

/**
 * Product Returns Page Component
 * 
 * Features:
 * - Displays detailed product information with focus on returns policy
 * - Image gallery with loading states
 * - Color/size selection
 * - Add to cart functionality
 * - Recommended products section
 * - Fallback to default product when requested product not found
 * 
 * State Management:
 * - Handles loading/error states
 * - Manages user selections (size, color, quantity)
 * - Tracks favorite status
 * 
 * @returns {JSX.Element} The product returns page
 */
const ProductReturns = () => {
  // Router Hooks
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Product State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDefaultFallback, setIsDefaultFallback] = useState(false);

  // User Selection State
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('returns');

  // Recommended Products Hook
  const {
    recommended: recommendedProducts,
    loading: recommendedLoading,
    error: recommendedError
  } = useRecommendedProducts(product?._id);

  /**
   * Fetches product data from API
   * Attempts to fetch requested product first, falls back to default product if not found
   */
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to fetch requested product
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        
        if (response.data.success && response.data.data) {
          setProduct(response.data.data);
          setIsDefaultFallback(false);
        } else {
          // Fallback to default product if requested product not found
          await fetchDefaultProduct();
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.message || err.message || 'Error fetching product');
        // Try to fetch default product as fallback
        await fetchDefaultProduct();
      } finally {
        setLoading(false);
      }
    };

    /**
     * Fetches default product as fallback
     */
    const fetchDefaultProduct = async () => {
      try {
        const defaultResponse = await axios.get('http://localhost:5000/api/products/default');
        if (defaultResponse.data.success && defaultResponse.data.data) {
          setProduct(defaultResponse.data.data);
          setIsDefaultFallback(true);
        }
      } catch (defaultErr) {
        console.error('Error fetching default product:', defaultErr);
      }
    };

    fetchProduct();
  }, [id]);

  /**
   * Sets default selections when product data is available
   */
  useEffect(() => {
    if (product) {
      if (product.colors?.length) setSelectedColor(product.colors[0]);
      if (product.sizes?.length) setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  /**
   * Handles image navigation
   * @param {string} direction - 'prev' or 'next'
   */
  const handleImageNavigation = (direction) => {
    setIsImageLoading(true);
    setCurrentImageIndex(prev => {
      const lastIndex = product?.images?.length - 1 || 0;
      return direction === 'next'
        ? prev === lastIndex ? 0 : prev + 1
        : prev === 0 ? lastIndex : prev - 1;
    });
  };

  /**
   * Adds current product to cart and navigates to cart page
   */
  const handleAddToCart = () => {
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
  };

  /**
   * Proceeds directly to checkout with current product
   */
  const handleBuyNow = () => {
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
  };

  /**
   * Navigates to different product tabs
   * @param {string} tab - The tab to navigate to
   */
  const navigateToTab = (tab) => {
    if (!product?._id) return;
    navigate(`/product/${product._id}/${tab}`, {
      state: { product }
    });
  };

  /**
   * Handles clicking on recommended products
   * @param {Object} clickedProduct - The product that was clicked
   */
  const handleProductClick = (clickedProduct) => {
    navigate(`/product/${clickedProduct._id || clickedProduct.id}`, {
      state: { product: clickedProduct }
    });
  };

  // Loading State
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

  // Error State (when no product is available)
  if (error && !product) {
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
        {/* Fallback Warning Banner */}
        {isDefaultFallback && (
          <div className={styles.defaultProductWarning}>
            <FaExclamationTriangle />
            <span>Showing a similar product as the requested item wasn't found</span>
          </div>
        )}

        <div className={styles.productContainer}>
          {/* Main Product Section */}
          <div className={styles.productMain}>
            {/* Image Gallery */}
            <div className={styles.productImages}>
              <div className={styles.mainImage}>
                {isImageLoading && (
                  <div className={styles.imageLoadingOverlay}>
                    <div className={styles.loadingSpinner}></div>
                  </div>
                )}
                {product.images?.length > 0 ? (
                  <img
                    src={product.images[currentImageIndex]}
                    alt={product.name}
                    className={`${styles.productMainImg} ${isImageLoading ? styles.hidden : ''}`}
                    onLoad={() => setIsImageLoading(false)}
                    onError={() => setIsImageLoading(false)}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>No Images Available</div>
                )}
                {product.images?.length > 1 && (
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

              {/* Image Navigation Dots */}
              {product.images?.length > 1 && (
                <div className={styles.imageDotsContainer}>
                  {product.images.map((_, index) => (
                    <span
                      key={index}
                      className={`${styles.dot} ${currentImageIndex === index ? styles.active : ''}`}
                      onClick={() => {
                        if (index !== currentImageIndex) {
                          setIsImageLoading(true);
                          setCurrentImageIndex(index);
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className={styles.productDetails}>
              <div className={styles.ratingFavoriteContainer}>
                <RatingStars rating={product.averageRating || product.rating} size="large" />
                <button
                  className={styles.favoriteButtonTop}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  {isFavorite ? <FaHeart className={styles.filled} /> : <FaRegHeart />}
                </button>
              </div>

              <h1 className={styles.productTitle}>{product.name}</h1>

              {isDefaultFallback && (
                <div className={styles.defaultProductNote}>
                  You might also like this similar product
                </div>
              )}

              <div className={styles.priceStock}>
                <span className={styles.price}>Rs. {product.price?.toFixed(2)}</span>
                <span className={styles.stock}>
                  {product.inStock ? 'In stock' : 'Out of stock'}
                </span>
              </div>

              <hr className={styles.divider} />

              {/* Color Selector */}
              {product.colors?.length > 0 && (
                <>
                  <div className={styles.colorSelector}>
                    <span className={styles.colorLabel}>Color: {selectedColor}</span>
                    <div className={styles.colorOptions}>
                      {product.colors.map((color) => (
                        <div
                          key={color}
                          className={`${styles.colorOptionWrapper} ${selectedColor === color ? styles.selected : ''}`}
                          onClick={() => setSelectedColor(color)}
                          style={{
                            borderColor: selectedColor === color ? color.toLowerCase() : '#999'
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

              {/* Size Selector */}
              {product.sizes?.length > 0 && (
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
              )}

              {/* Quantity Selector */}
              <div className={styles.quantityControl}>
                <div className={styles.quantitySelector}>
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
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
              <div className={styles.productActions}>
                <button
                  className={styles.addToCart}
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isImageLoading}
                >
                  <FaShoppingCart /> Add To Cart
                </button>
                <button
                  className={styles.buyNow}
                  onClick={handleBuyNow}
                  disabled={!product.inStock || isImageLoading}
                >
                  <FaShoppingBag /> Buy Now
                </button>
              </div>

              {/* Secure Checkout Badge */}
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

          {/* Tabs Section */}
          <div className={styles.tabsSection}>
            <ProductTabs
              activeTab={activeTab}
              onSelectTab={navigateToTab}
              productId={product._id}
            />
            <div className={styles.tabContent}>
              <div className={styles.returnsContent}>
                <h2>RETURN POLICY</h2>
                <div className={styles.policySection}>
                  <p>
                    {product.returnsInfo?.trim() || `
                      Our dispatch head time is 7 working days for orders that include both ready-to-strip 
                      and made-on-order pieces. If you would like the ready-to-strip pieces to be dispatched 
                      early, please mention in the NOTES section of checkout.
                    `}
                  </p>
                  <p>
                    Returns must be initiated within 3 days of delivery. Returns include exchange of size, 
                    style or credit note only.
                  </p>
                  <p>
                    COD, returns and exchanges are not possible on customized garments.
                  </p>
                </div>

                <h2>SHIPPING POLICY</h2>
                <div className={styles.policySection}>
                  <p>Enjoy free shipping on all orders.</p>
                  <p>Standard delivery time is 5-7 business days.</p>
                  <p>Express shipping options available at checkout.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Products Section */}
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
            ) : (
              <div className={styles.productGrid}>
                {recommendedProducts.length > 0 ? (
                  recommendedProducts.map((item) => (
                    <ProductCard
                      key={item._id}
                      product={item}
                      variant="small"
                      onClick={() => handleProductClick(item)}
                    />
                  ))
                ) : (
                  <div className={styles.noRecommendations}>
                    <p>No recommended products available at this time</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductReturns;