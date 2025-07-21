import React, { useState, useEffect } from 'react';
import {
  FaShoppingCart,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaRegHeart,
  FaShoppingBag,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import ProductCard from '../../Components/ProductCard/ProductCard';
import RatingStars from '../../Components/RatingStars/RatingStars';
import ProductTabs from '../../Components/ProductTabs/ProductTabs';
import Footer from '../../Components/Footer/Footer';
import Header from '../../Components/Header/Header';
import useRecommendedProducts from '../../hooks/useRecommendedProducts';

import styles from './ProductReturns.module.css';

const BASE_URL = 'http://localhost:5000/api';
const WISHLIST_URL = `${BASE_URL}/wishlist`;

const fixImageUrl = (img) => {
  if (typeof img !== 'string' || !img.trim()) return '/images/placeholder.jpg';
  if (img.startsWith('http')) return img;
  if (img.startsWith('/images')) return img;
  img = img.replace(/^\/?assets\//, '');
  return `/images/${img}`;
};

const ProductReturns = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDefaultFallback, setIsDefaultFallback] = useState(false);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('returns');

  const [reviewSummary, setReviewSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
    breakdown: {}
  });

  const {
    recommended: recommendedProducts,
    loading: recommendedLoading,
    error: recommendedError
  } = useRecommendedProducts(product?._id);

  // Fetch user's wishlist IDs on mount and when product changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !product?._id) return;
    fetch(`${WISHLIST_URL}/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401) {
          alert('Session expired. Please log in again.');
          window.location.href = '/signin';
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then(data => {
        if (!data) return;
        const ids = data?.products?.map(p => p._id) || [];
        setWishlistIds(ids);
        setIsFavorite(ids.includes(product._id));
      });
  }, [product?._id]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        if (response.data.success && response.data.data) {
          const productData = response.data.data;
          const processedProduct = {
            ...productData,
            images: (productData.images || []).map(fixImageUrl)
          };
          setProduct(processedProduct);
          setIsDefaultFallback(false);
          
          // Fetch review summary
          const summaryRes = await axios.get(`http://localhost:5000/api/reviews/summary/${productData._id}`);
          setReviewSummary(summaryRes.data);
        } else {
          await fetchDefaultProduct();
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error fetching product');
        await fetchDefaultProduct();
      } finally {
        setLoading(false);
      }
    };

    const fetchDefaultProduct = async () => {
      try {
        const defaultResponse = await axios.get('http://localhost:5000/api/products/default');
        if (defaultResponse.data.success && defaultResponse.data.data) {
          const productData = defaultResponse.data.data;
          const processedProduct = {
            ...productData,
            images: (productData.images || []).map(fixImageUrl)
          };
          setProduct(processedProduct);
          setIsDefaultFallback(true);
          
          // Fetch review summary for default product
          const summaryRes = await axios.get(`http://localhost:5000/api/reviews/summary/${productData._id}`);
          setReviewSummary(summaryRes.data);
        }
      } catch (defaultErr) {
        console.error('Error fetching default product:', defaultErr);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      if (product.colors?.length) setSelectedColor(product.colors[0]);
      if (product.sizes?.length) setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  const handleImageNavigation = (direction) => {
    setIsImageLoading(true);
    setCurrentImageIndex((prev) => {
      const lastIndex = product?.images?.length - 1 || 0;
      return direction === 'next'
        ? prev === lastIndex ? 0 : prev + 1
        : prev === 0 ? lastIndex : prev - 1;
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    const size = selectedSize || product.selectedSize || product.size || (product.sizes && product.sizes[0]) || null;
    const color = selectedColor || product.selectedColor || product.color || (product.colors && product.colors[0]) || null;
    let cart;
    try {
      cart = JSON.parse(localStorage.getItem('cart'));
      if (!Array.isArray(cart)) cart = [];
    } catch {
      cart = [];
    }
    const existingIndex = cart.findIndex(item => item._id === product._id && (item.selectedSize || item.size || null) === size && (item.selectedColor || item.color || null) === color);
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        ...product,
        selectedSize: size,
        selectedColor: color,
        quantity
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartChanged'));
    navigate('/cart');
  };

  const handleBuyNow = () => {
    if (!product) return;
    const size = selectedSize || product.selectedSize || product.size || (product.sizes && product.sizes[0]) || null;
    const color = selectedColor || product.selectedColor || product.color || (product.colors && product.colors[0]) || null;
    
    navigate('/checkout', {
      state: {
        product: {
          ...product,
          selectedSize: size,
          selectedColor: color,
          quantity
        }
      }
    });
  };

  const handleWishlistToggle = async () => {
    if (!product?._id) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first.');
      window.location.href = '/signin';
      return;
    }
    const isInWishlist = wishlistIds.includes(product._id);
    const method = isInWishlist ? 'DELETE' : 'POST';
    try {
      const response = await fetch(`${WISHLIST_URL}/${product._id}`, {
        method,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401) {
        alert('Session expired. Please log in again.');
        window.location.href = '/signin';
        return;
      }
      if (!response.ok) {
        const error = await response.json();
        return alert(`Error: ${error.error || response.statusText}`);
      }
      const updated = await fetch(`${WISHLIST_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => {
        if (res.status === 401) {
          alert('Session expired. Please log in again.');
          window.location.href = '/signin';
          return null;
        }
        return res.json();
      });
      if (!updated) return;
      const updatedIds = updated?.products?.map(p => p._id) || [];
      setWishlistIds(updatedIds);
      setIsFavorite(updatedIds.includes(product._id));
    } catch (err) {
      alert('Network error while updating wishlist.');
    }
  };

  const navigateToTab = (tab) => {
    if (!product?._id) return;
    navigate(`/product/${product._id}/${tab}`, {
      state: { product }
    });
  };

  const handleProductClick = (clickedProduct) => {
    const processedProduct = {
      ...clickedProduct,
      images: (clickedProduct.images || []).map(fixImageUrl)
    };
    navigate(`/product/${clickedProduct._id || clickedProduct.id}`, {
      state: { product: processedProduct }
    });
  };

  useEffect(() => {
    if (!product?._id) return;
    const maxRecentlyViewed = 8;
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    recentlyViewed = recentlyViewed.filter(p => p._id !== product._id);
    recentlyViewed.unshift({
      _id: product._id,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.price,
    });
    recentlyViewed = recentlyViewed.slice(0, maxRecentlyViewed);
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [product]);

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
        {isDefaultFallback && (
          <div className={styles.defaultProductWarning}>
            <FaExclamationTriangle />
            <span>Showing a similar product as the requested item wasn't found</span>
          </div>
        )}

        <div className={styles.productContainer}>
          <div className={styles.productMain}>
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
                    onError={(e) => {
                      setIsImageLoading(false);
                      e.target.src = '/images/placeholder.jpg';
                    }}
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

            <div className={styles.productDetails}>
              <div className={styles.ratingFavoriteContainer}>
                <RatingStars 
                  rating={reviewSummary.averageRating || product.rating} 
                  size="large" 
                />
                <button
                  className={styles.favoriteButtonTop}
                  onClick={handleWishlistToggle}
                >
                  {isFavorite ? <FaHeart className={styles.filled} /> : <FaRegHeart />}
                </button>
              </div>

              <h1 className={styles.productTitle}>{product.name}</h1>

              <div className={styles.priceStock}>
                <span className={styles.price}>Rs. {product.price?.toFixed(2)}</span>
                <span className={styles.stock}>
                  {product.inStock ? 'In stock' : 'Out of stock'}
                </span>
              </div>

              <hr className={styles.divider} />

              {product.colors?.length > 0 && (
                <>
                  <div className={styles.colorSelector}>
                    <span className={styles.colorLabel}>Color: {selectedColor}</span>
                    <div className={styles.colorOptions}>
                      {product.colors.map((color) => (
                        <div
                          key={color}
                          className={`${styles.colorOptionWrapper} ${
                            selectedColor === color ? styles.colorOptionWrapperSelected : ''
                          }`}
                          onClick={() => setSelectedColor(color)}
                          style={{
                            borderColor: selectedColor === color ? color.toLowerCase() : 'transparent'
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

              <div className={styles.quantityControl}>
                <div className={styles.quantitySelector}>
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

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

              <div className={styles.secureCheckout}>
                <div className={styles.secureIcons}>
                  <img src="/images/product/trustbag.png" alt="Secure Payment" loading="lazy" />
                </div>
                <p>Guarantee safe & secure checkout</p>
              </div>
            </div>
          </div>

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
                  <p>{product.returnsInfo?.trim() || 'Returns accepted within 30 days of purchase. Exchange of size and style available.'}</p>
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
                  recommendedProducts.map((item) => {
                    const processedItem = {
                      ...item,
                      images: (item.images || []).map(fixImageUrl)
                    };
                    return (
                      <ProductCard
                        key={processedItem._id}
                        product={processedItem}
                        variant="small"
                        onClick={() => handleProductClick(processedItem)}
                      />
                    );
                  })
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
