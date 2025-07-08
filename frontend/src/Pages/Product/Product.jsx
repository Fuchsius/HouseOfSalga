import React, { useEffect, useState } from 'react';
import {
  FaShoppingCart,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaShoppingBag,
  FaRegHeart,
  FaExclamationTriangle
} from 'react-icons/fa';
import {
  useParams,
  useNavigate,
  useLocation
} from 'react-router-dom';
import axios from 'axios';

import ProductCard from '../../Components/ProductCard/ProductCard';
import RatingStars from '../../Components/RatingStars/RatingStars';
import ProductTabs from '../../Components/ProductTabs/ProductTabs';
import Footer from '../../Components/Footer/Footer';
import Header from '../../Components/Header/Header';
import styles from './Product.module.css';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDefaultFallback, setIsDefaultFallback] = useState(false);

  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [recommendedError, setRecommendedError] = useState(null);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

  const fixImageUrl = (img) => {
  if (typeof img !== 'string' || !img.trim()) {
    return '/images/placeholder.jpg';
  }

  if (img.startsWith('http')) {
    return img;
  }

  // If already starts with /images, use as is
  if (img.startsWith('/images')) {
    return img;
  }

  // Remove known wrong prefixes like /assets/
  img = img.replace(/^\/?assets\//, '');

  // Serve from /images directory
  return `/images/${img}`;
};


  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);

        if (response.data.success && response.data.data) {
          const productData = response.data.data;

          const updatedProduct = {
            ...productData,
            name: productData.name || 'Unnamed Product',
            price: productData.price ?? 0,
            description: productData.description || 'No description available.',
            inStock: productData.inStock ?? false,
            sizes: productData.sizes || [],
            colors: productData.colors || [],
            images: (productData.images || []).map(fixImageUrl)
          };

          console.log("✅ Final product data:", updatedProduct);
          setProduct(updatedProduct);
          setIsDefaultFallback(false);

          setSelectedSize(updatedProduct.sizes[0] || null);
          setSelectedColor(updatedProduct.colors[0] || null);
        } else {
          setError(response.data.message || 'Product not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error fetching product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      if (!product?._id) return;

      setRecommendedLoading(true);
      setRecommendedError(null);

      try {
        const response = await axios.get(`http://localhost:5000/api/products/recommended/${product._id}`);
        if (response.data.success) {
          const fixedRecommended = response.data.data.map(p => ({
            ...p,
            images: (p.images || []).map(fixImageUrl)
          }));
          setRecommendedProducts(fixedRecommended);
        } else {
          setRecommendedError(response.data.message || 'Failed to load recommendations');
        }
      } catch (err) {
        setRecommendedError(err.response?.data?.message || err.message || 'Error loading recommendations');
      } finally {
        setRecommendedLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, [product]);

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const tabFromRoute = pathParts[pathParts.length - 1];
    if (['description', 'reviews', 'returns'].includes(tabFromRoute)) {
      setActiveTab(tabFromRoute);
    } else {
      setActiveTab('description');
    }
  }, [location.pathname]);

  const handleImageNavigation = (direction) => {
    setIsImageLoading(true);
    setCurrentImageIndex(prev => {
      const lastIndex = product?.images?.length - 1 || 0;
      return direction === 'next'
        ? prev === lastIndex ? 0 : prev + 1
        : prev === 0 ? lastIndex : prev - 1;
    });
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

  const navigateToTab = (tab) => {
    if (!product?._id) return;
    navigate(`/product/${product._id}/${tab}`);
  };

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

  if (error || !product) {
    return (
      <div className={styles.errorContainer}>
        <Header />
        <div className={styles.errorContent}>
          <FaExclamationTriangle className={styles.errorIcon} />
          <h2>Product Not Found</h2>
          <p>{error || 'We couldn\'t find the product you\'re looking for.'}</p>
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
                  productId={product._id} 
                  rating={product.averageRating || product.rating} 
                  size="large" 
                />
                <button
                  className={styles.favoriteButtonTop}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  {isFavorite ? <FaHeart className={styles.filled} /> : <FaRegHeart />}
                </button>
              </div>

              <h1 className={styles.productTitle}>{product.name}</h1>
              <a href="#!" className={styles.viewSaves}>
                View including taxes
              </a>

              <div className={styles.priceStock}>
                <span className={styles.price}>Rs. {product.price.toFixed(2)}</span>
                <span className={styles.stock}>
                  {product.inStock ? 'In stock' : 'Out of stock'}
                </span>
              </div>

              <hr className={styles.divider} />

              {product.colors.length > 0 && (
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

              {product.sizes.length > 0 && (
                <div className={styles.sizeSelector}>
                  <span>Size: {selectedSize}</span>
                  <div className={styles.sizeOptions}>
                    {product.sizes.map((size) => (
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
                    disabled={quantity <= 1}
                  >-</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
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

          <div className={styles.tabsSection}>
            <ProductTabs 
              activeTab={activeTab} 
              onSelectTab={navigateToTab}
              productId={product._id}
            />
            <div className={styles.tabContent}>
              {activeTab === 'description' && (
                <div className={styles.productDescription}>
                  <h2>Product Description</h2>
                  <p>{product.description}</p>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className={styles.reviewsContent}>
                  <h2>Customer Reviews</h2>
                </div>
              )}
              {activeTab === 'returns' && (
                <div className={styles.returnsContent}>
                  <h2>Return Policy</h2>
                  <p>{product.returnsInfo || 'Standard return policy applies.'}</p>
                </div>
              )}
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
                  recommendedProducts.map((p) => (
                    <ProductCard
                      key={p._id}
                      product={p}
                      variant="small"
                      onClick={() => navigate(`/product/${p._id}`)}
                    />
                  ))
                ) : (
                  <p className={styles.noRecommendations}>
                    No recommendations available at this time.
                  </p>
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

export default Product;
