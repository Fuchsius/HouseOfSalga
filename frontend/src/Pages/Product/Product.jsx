// import React, { useEffect, useState } from 'react';
// import {
//   FaShoppingCart,
//   FaChevronLeft,
//   FaChevronRight,
//   FaHeart,
//   FaShoppingBag,
//   FaRegHeart,
//   FaExclamationTriangle
// } from 'react-icons/fa';
// import {
//   useParams,
//   useNavigate,
//   useLocation
// } from 'react-router-dom';
// import axios from 'axios';

// import ProductCard from '../../Components/ProductCard/ProductCard';
// import RatingStars from '../../Components/RatingStars/RatingStars';
// import ProductTabs from '../../Components/ProductTabs/ProductTabs';
// import Footer from '../../Components/Footer/Footer';
// import Header from '../../Components/Header/Header';

// import styles from './Product.module.css';

// const BASE_URL = 'http://localhost:5000/api';
// const WISHLIST_URL = `${BASE_URL}/wishlist`;

// const Product = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Product state
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isDefaultFallback, setIsDefaultFallback] = useState(false);

//   // Recommended products state
//   const [recommendedProducts, setRecommendedProducts] = useState([]);
//   const [recommendedLoading, setRecommendedLoading] = useState(false);
//   const [recommendedError, setRecommendedError] = useState(null);

//   // User selections
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [wishlistIds, setWishlistIds] = useState([]);
//   // Fetch user's wishlist IDs on mount and when product changes
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token || !product?._id) return;
//     fetch(`${WISHLIST_URL}/me`, {
//       headers: { 'Authorization': `Bearer ${token}` }
//     })
//       .then(res => {
//         if (res.status === 401) {
//           alert('Session expired. Please log in again.');
//           window.location.href = '/signin';
//           return null;
//         }
//         return res.ok ? res.json() : null;
//       })
//       .then(data => {
//         if (!data) return;
//         const ids = data?.products?.map(p => p._id) || [];
//         setWishlistIds(ids);
//         setIsFavorite(ids.includes(product._id));
//       });
//   }, [product?._id]);
//   const [isImageLoading, setIsImageLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('description');

//   // Fetch product data
//   useEffect(() => {
//     const fetchProduct = async () => {
//       setLoading(true);
//       setError(null);
      
//       try {
//         const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        
//         if (response.data.success && response.data.data) {
//           const productData = response.data.data;
//           setProduct(productData);
//           setIsDefaultFallback(false);
          
//           // Set default selections
//           setSelectedSize(productData.sizes?.[0] || null);
//           setSelectedColor(productData.colors?.[0] || null);
//         } else {
//           setError(response.data.message || 'Product not found');
//         }
//       } catch (err) {
//         setError(err.response?.data?.message || err.message || 'Error fetching product');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   // Fetch recommended products when product data is available
//   useEffect(() => {
//     const fetchRecommendedProducts = async () => {
//       if (!product?._id) return;
      
//       setRecommendedLoading(true);
//       setRecommendedError(null);
      
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/products/recommended/${product._id}`
//         );
        
//         if (response.data.success) {
//           setRecommendedProducts(response.data.data);
//         } else {
//           setRecommendedError(response.data.message || 'Failed to load recommendations');
//         }
//       } catch (err) {
//         setRecommendedError(
//           err.response?.data?.message || 
//           err.message || 
//           'Error loading recommendations'
//         );
//       } finally {
//         setRecommendedLoading(false);
//       }
//     };

//     fetchRecommendedProducts();
//   }, [product]);

//   // Handle tab changes based on route
//   useEffect(() => {
//     const pathParts = location.pathname.split('/');
//     const tabFromRoute = pathParts[pathParts.length - 1];
    
//     if (['description', 'reviews', 'returns'].includes(tabFromRoute)) {
//       setActiveTab(tabFromRoute);
//     } else {
//       setActiveTab('description');
//     }
//   }, [location.pathname]);

//   // Image navigation handlers
//   const handleImageNavigation = (direction) => {
//     setIsImageLoading(true);
//     setCurrentImageIndex(prev => {
//       const lastIndex = product?.images?.length - 1 || 0;
//       return direction === 'next'
//         ? prev === lastIndex ? 0 : prev + 1
//         : prev === 0 ? lastIndex : prev - 1;
//     });
//   };

//   // Cart and checkout handlers
//   const handleAddToCart = async () => {
//     if (!product) return;

//     const size = selectedSize;
//     const color = selectedColor;

//     if (!size || !color) {
//       alert('Please select size and color.');
//       return;
//     }

//     const token = localStorage.getItem('token');
//     if (token) {
//       // LOGGED IN: Add to backend cart
//       try {
//         const res = await fetch('http://localhost:5000/api/cart/add', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({
//             productId: product._id,
//             quantity,
//             size,
//             color
//           })
//         });
//         if (!res.ok) {
//           alert('Failed to add to cart');
//           return;
//         }
//         window.dispatchEvent(new Event('cart-updated'));
//         navigate('/cart');
//       } catch (err) {
//         alert('Network error while adding to cart');
//       }
//     } else {
//       // GUEST: Add to localStorage
//       let cart = [];
//       try {
//         const storedCart = localStorage.getItem('cart');
//         cart = storedCart ? JSON.parse(storedCart) : [];
//         if (!Array.isArray(cart)) cart = [];
//       } catch (err) {
//         cart = [];
//       }
//       const existingIndex = cart.findIndex(
//         item =>
//           item._id === product._id &&
//           item.selectedSize === size &&
//           item.selectedColor === color
//       );
//       if (existingIndex !== -1) {
//         cart[existingIndex].quantity += quantity;
//       } else {
//         const cartItem = {
//           _id: product._id,
//           name: product.name,
//           price: product.price,
//           image: product.images?.[0] || '',
//           selectedSize: size,
//           selectedColor: color,
//           quantity,
//           inStock: product.inStock
//         };
//         cart.push(cartItem);
//       }
//       localStorage.setItem('cart', JSON.stringify(cart));
//       window.dispatchEvent(new Event('cart-updated'));
//       navigate('/cart');
//     }
//   };


//   const handleBuyNow = () => {
//     navigate('/checkout', {
//       state: {
//         product: {
//           ...product,
//           selectedSize,
//           selectedColor,
//           quantity
//         }
//       }
//     });
//   };

//   // Wishlist handler (API-based, like ProductCard)
//   const handleWishlistToggle = async () => {
//     if (!product?._id) return;
//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('Please log in first.');
//       window.location.href = '/signin';
//       return;
//     }
//     const isInWishlist = wishlistIds.includes(product._id);
//     const method = isInWishlist ? 'DELETE' : 'POST';
//     try {
//       const response = await fetch(`${WISHLIST_URL}/${product._id}`, {
//         method,
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       if (response.status === 401) {
//         alert('Session expired. Please log in again.');
//         window.location.href = '/signin';
//         return;
//       }
//       if (!response.ok) {
//         const error = await response.json();
//         return alert(`Error: ${error.error || response.statusText}`);
//       }
//       // Refetch wishlist IDs
//       const updated = await fetch(`${WISHLIST_URL}/me`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       }).then(res => {
//         if (res.status === 401) {
//           alert('Session expired. Please log in again.');
//           window.location.href = '/signin';
//           return null;
//         }
//         return res.json();
//       });
//       if (!updated) return;
//       const updatedIds = updated?.products?.map(p => p._id) || [];
//       setWishlistIds(updatedIds);
//       setIsFavorite(updatedIds.includes(product._id));
//     } catch (err) {
//       alert('Network error while updating wishlist.');
//     }
//   };

//   // Save to recently viewed in localStorage
//   useEffect(() => {
//     if (!product?._id) return;
//     const maxRecentlyViewed = 5;
//     let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
//     // Remove if already exists
//     recentlyViewed = recentlyViewed.filter(p => p._id !== product._id);
//     // Add to front
//     recentlyViewed.unshift({
//       _id: product._id,
//       name: product.name,
//       image: product.images?.[0] || '',
//       price: product.price,
//       // Add more fields if needed
//     });
//     // Keep only latest 8
//     recentlyViewed = recentlyViewed.slice(0, maxRecentlyViewed);
//     localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
//   }, [product]);

//   // Navigate between tabs
//   const navigateToTab = (tab) => {
//     if (!product?._id) return;
//     navigate(`/product/${product._id}/${tab}`);
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className={styles.loadingOverlay}>
//         <Header />
//         <div className={styles.loadingContent}>
//           <div className={styles.loadingSpinner}></div>
//           <p>Loading product details...</p>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   // Error state
//   if (error || !product) {
//     return (
//       <div className={styles.errorContainer}>
//         <Header />
//         <div className={styles.errorContent}>
//           <FaExclamationTriangle className={styles.errorIcon} />
//           <h2>Product Not Found</h2>
//           <p>{error || 'We couldn\'t find the product you\'re looking for.'}</p>
//           <button 
//             className={styles.continueShopping}
//             onClick={() => navigate('/')}
//           >
//             Continue Shopping
//           </button>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <>
//       <Header />
//       <div className={styles.productPage}>
//         {isDefaultFallback && (
//           <div className={styles.defaultProductWarning}>
//             <FaExclamationTriangle />
//             <span>Showing a similar product as the requested item wasn't found</span>
//           </div>
//         )}

//         <div className={styles.productContainer}>
//           <div className={styles.productMain}>
//             {/* Image Gallery */}
//             <div className={styles.productImages}>
//               <div className={styles.mainImage}>
//                 {isImageLoading && (
//                   <div className={styles.imageLoadingOverlay}>
//                     <div className={styles.loadingSpinner}></div>
//                   </div>
//                 )}
//                 {product.images?.length > 0 ? (
//                   <img
//                     src={product.images[currentImageIndex]}
//                     alt={product.name}
//                     className={`${styles.productMainImg} ${isImageLoading ? styles.hidden : ''}`}
//                     onLoad={() => setIsImageLoading(false)}
//                     onError={() => setIsImageLoading(false)}
//                   />
//                 ) : (
//                   <div className={styles.imagePlaceholder}>No Images Available</div>
//                 )}
//                 {product.images?.length > 1 && (
//                   <>
//                     <button
//                       className={`${styles.navButton} ${styles.prev}`}
//                       onClick={() => handleImageNavigation('prev')}
//                       disabled={isImageLoading}
//                     >
//                       <FaChevronLeft />
//                     </button>
//                     <button
//                       className={`${styles.navButton} ${styles.next}`}
//                       onClick={() => handleImageNavigation('next')}
//                       disabled={isImageLoading}
//                     >
//                       <FaChevronRight />
//                     </button>
//                   </>
//                 )}
//               </div>

//               {/* Image Navigation Dots */}
//               {product.images?.length > 1 && (
//                 <div className={styles.imageDotsContainer}>
//                   {product.images.map((_, index) => (
//                     <span
//                       key={index}
//                       className={`${styles.dot} ${currentImageIndex === index ? styles.active : ''}`}
//                       onClick={() => {
//                         if (index !== currentImageIndex) {
//                           setIsImageLoading(true);
//                           setCurrentImageIndex(index);
//                         }
//                       }}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Product Details */}
//             <div className={styles.productDetails}>
//               <div className={styles.ratingFavoriteContainer}>
//                 <RatingStars 
//                   productId={product._id} 
//                   rating={product.averageRating || product.rating} 
//                   size="large" 
//                 />
//                 <button
//                   className={styles.favoriteButtonTop}
//                   onClick={handleWishlistToggle}
//                   aria-label="Toggle favorite"
//                 >
//                   {isFavorite ? <FaHeart className={styles.filled} /> : <FaRegHeart />}
//                 </button>
//               </div>

//               <h1 className={styles.productTitle}>{product.name}</h1>
//               <a href="#!" className={styles.viewSaves}>
//                 View including taxes
//               </a>

//               <div className={styles.priceStock}>
//                 <span className={styles.price}>Rs. {product.price.toFixed(2)}</span>
//                 <span className={styles.stock}>
//                   {product.inStock ? 'In stock' : 'Out of stock'}
//                 </span>
//               </div>

//               <hr className={styles.divider} />

//               {/* Color Selector */}
//               {product.colors?.length > 0 && (
//                 <>
//                   <div className={styles.colorSelector}>
//                     <span className={styles.colorLabel}>Color: {selectedColor}</span>
//                     <div className={styles.colorOptions}>
//                       {product.colors.map((color) => (
//                         <div
//                           key={color}
//                           className={`${styles.colorOptionWrapper} ${
//                             selectedColor === color ? styles.colorOptionWrapperSelected : ''
//                           }`}
//                           onClick={() => setSelectedColor(color)}
//                           style={{
//                             borderColor: selectedColor === color ? color.toLowerCase() : undefined
//                           }}
//                         >
//                           <div
//                             className={styles.colorOption}
//                             style={{
//                               backgroundColor: color.toLowerCase(),
//                               borderColor: color.toLowerCase()
//                             }}
//                             aria-label={color}
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                   <hr className={styles.divider} />
//                 </>
//               )}

//               {/* Size Selector */}
//               {product.sizes?.length > 0 && (
//                 <div className={styles.sizeSelector}>
//                   <span>Size: {selectedSize}</span>
//                   <div className={styles.sizeOptions}>
//                     {product.sizes.map((size) => (
//                       <button
//                         key={size}
//                         className={`${styles.sizeOption} ${
//                           selectedSize === size ? styles.sizeOptionSelected : ''
//                         }`}
//                         onClick={() => setSelectedSize(size)}
//                       >
//                         {size}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Quantity Selector */}
//               <div className={styles.quantityControl}>
//                 <div className={styles.quantitySelector}>
//                   <button 
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))} 
//                     aria-label="Decrease quantity"
//                     disabled={quantity <= 1}
//                   >
//                     -
//                   </button>
//                   <span aria-live="polite">{quantity}</span>
//                   <button 
//                     onClick={() => setQuantity(quantity + 1)} 
//                     aria-label="Increase quantity"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className={styles.productActions}>
//                 <button 
//                   className={styles.addToCart} 
//                   onClick={handleAddToCart}
//                   disabled={!product.inStock || isImageLoading}
//                 >
//                   <FaShoppingCart /> Add To Cart
//                 </button>
//                 <button 
//                   className={styles.buyNow} 
//                   onClick={handleBuyNow}
//                   disabled={!product.inStock || isImageLoading}
//                 >
//                   <FaShoppingBag /> Buy Now
//                 </button>
//               </div>

//               {/* Secure Checkout Badge */}
//               <div className={styles.secureCheckout}>
//                 <div className={styles.secureIcons}>
//                   <img 
//                     src="/images/product/trustbag.png" 
//                     alt="Secure Payment" 
//                     loading="lazy" 
//                   />
//                 </div>
//                 <p>Guarantee safe & secure checkout</p>
//               </div>
//             </div>
//           </div>

//           {/* Product Tabs */}
//           <div className={styles.tabsSection}>
//             <ProductTabs 
//               activeTab={activeTab} 
//               onSelectTab={navigateToTab}
//               productId={product._id}
//             />
//             <div className={styles.tabContent}>
//               {activeTab === 'description' && (
//                 <div className={styles.productDescription}>
//                   <h2>Product Description</h2>
//                   <p>{product.description}</p>
//                 </div>
//               )}
//               {activeTab === 'reviews' && (
//                 <div className={styles.reviewsContent}>
//                   <h2>Customer Reviews</h2>
//                   {/* Reviews content would go here */}
//                 </div>
//               )}
//               {activeTab === 'returns' && (
//                 <div className={styles.returnsContent}>
//                   <h2>Return Policy</h2>
//                   <p>{product.returnsInfo || 'Standard return policy applies.'}</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Recommended Products */}
//           <div className={styles.recommendedProducts}>
//             <h2>Recommended</h2>
//             <p className={styles.subtitle}>You might want to take a look at these.</p>
            
//             {recommendedLoading ? (
//               <div className={styles.loadingRecommendations}>
//                 <div className={styles.loadingSpinner}></div>
//                 <p>Loading recommendations...</p>
//               </div>
//             ) : recommendedError ? (
//               <p className={styles.errorText}>{recommendedError}</p>
//             ) : (
//               <div className={styles.productGrid}>
//                 {recommendedProducts.length > 0 ? (
//                   recommendedProducts.map((p) => (
//                     <ProductCard
//                       key={p._id}
//                       product={p}
//                       variant="small"
//                       onClick={() => navigate(`/product/${p._id}`)}
//                     />
//                   ))
//                 ) : (
//                   <p className={styles.noRecommendations}>
//                     No recommendations available at this time.
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Product;
import React, { useState, useEffect, useRef } from 'react';
import {
  FaShoppingCart,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaRegHeart,
  FaShoppingBag,
  FaExclamationTriangle,
  FaThumbsUp,
  FaReply,
  FaStar,
  FaAngleDown,
  FaAngleUp
} from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../Components/ProductCard/ProductCard';
import RatingStars from '../../Components/RatingStars/RatingStars';
import Footer from '../../Components/Footer/Footer';
import Header from '../../Components/Header/Header';
import styles from './Product.module.css';

// Base API URLs
const BASE_URL = 'http://localhost:5000/api';
const WISHLIST_URL = `${BASE_URL}/wishlist`;

/**
 * Helper function to fix image URLs
 * Ensures images have proper paths whether they come from local storage or external URLs
 */
const fixImageUrl = (img) => {
  if (typeof img !== 'string' || !img.trim()) return '/images/placeholder.jpg';
  if (img.startsWith('http')) return img; // External URL
  if (img.startsWith('/images')) return img; // Already correct local path
  img = img.replace(/^\/?assets\//, ''); // Remove assets/ prefix if present
  return `/images/${img}`; // Standardize local image path
};

const Product = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();

  // Product state management
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDefaultFallback, setIsDefaultFallback] = useState(false);

  // Recommended products state
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [recommendedError, setRecommendedError] = useState(null);

  // User selections state
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

  // Reviews state management
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
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Fetch product data when component mounts or ID changes
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${BASE_URL}/products/${id}`);
        
        if (response.data.success && response.data.data) {
          const productData = response.data.data;
          // Process images to ensure correct URLs
          const processedProduct = {
            ...productData,
            images: (productData.images || []).map(fixImageUrl)
          };
          setProduct(processedProduct);
          setIsDefaultFallback(false);
          
          // Set default selections for size and color
          setSelectedSize(productData.sizes?.[0] || null);
          setSelectedColor(productData.colors?.[0] || null);

          // Fetch review summary for the product
          const summaryRes = await axios.get(`${BASE_URL}/reviews/summary/${productData._id}`);
          setReviewSummary(summaryRes.data);
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

  // Fetch recommended products when product data is available
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      if (!product?._id) return;
      
      setRecommendedLoading(true);
      setRecommendedError(null);
      
      try {
        const response = await axios.get(`${BASE_URL}/products/recommended/${product._id}`);
        
        if (response.data.success) {
          setRecommendedProducts(response.data.data);
        } else {
          setRecommendedError(response.data.message || 'Failed to load recommendations');
        }
      } catch (err) {
        setRecommendedError(
          err.response?.data?.message || 
          err.message || 
          'Error loading recommendations'
        );
      } finally {
        setRecommendedLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, [product]);

  // Fetch reviews when product loads
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?._id) return;
      
      try {
        setIsLoadingReviews(true);
        // Fetch both reviews and summary in parallel
        const [reviewsRes, summaryRes] = await Promise.all([
          axios.get(`${BASE_URL}/reviews/${product._id}`),
          axios.get(`${BASE_URL}/reviews/summary/${product._id}`)
        ]);
        
        setReviews(reviewsRes.data);
        setReviewSummary(summaryRes.data);
        
        // Update product's average rating if it changed
        if (summaryRes.data.averageRating !== product.averageRating) {
          setProduct(prev => ({
            ...prev,
            averageRating: summaryRes.data.averageRating
          }));
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [product]);

  // Fetch user's wishlist IDs when product loads
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

  // Save to recently viewed in localStorage
  useEffect(() => {
    if (!product?._id) return;
    const maxRecentlyViewed = 8;
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    // Remove if already exists to avoid duplicates
    recentlyViewed = recentlyViewed.filter(p => p._id !== product._id);
    // Add to beginning of array
    recentlyViewed.unshift({
      _id: product._id,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.price,
    });
    // Limit to max number of items
    recentlyViewed = recentlyViewed.slice(0, maxRecentlyViewed);
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [product]);

  /**
   * Handles image navigation (next/previous)
   * @param {string} direction - 'next' or 'prev'
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
   * Changes the active tab
   * @param {string} tab - Tab name to activate
   */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  /**
   * Adds the current product to cart
   * Handles both logged in users (backend) and guests (localStorage)
   */
  const handleAddToCart = async () => {
    if (!product) return;

    const size = selectedSize;
    const color = selectedColor;

    if (!size || !color) {
      alert('Please select size and color.');
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      // LOGGED IN: Add to backend cart
      try {
        const res = await fetch(`${BASE_URL}/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            productId: product._id,
            quantity,
            size,
            color
          })
        });
        if (!res.ok) {
          alert('Failed to add to cart');
          return;
        }
        // Dispatch event to update cart indicators
        window.dispatchEvent(new Event('cart-updated'));
        navigate('/cart');
      } catch (err) {
        alert('Network error while adding to cart');
      }
    } else {
      // GUEST: Add to localStorage
      let cart = [];
      try {
        const storedCart = localStorage.getItem('cart');
        cart = storedCart ? JSON.parse(storedCart) : [];
        if (!Array.isArray(cart)) cart = [];
      } catch (err) {
        cart = [];
      }
      // Check if item already exists in cart
      const existingIndex = cart.findIndex(
        item =>
          item._id === product._id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );
      if (existingIndex !== -1) {
        // Increment quantity if exists
        cart[existingIndex].quantity += quantity;
      } else {
        // Add new item to cart
        const cartItem = {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '',
          selectedSize: size,
          selectedColor: color,
          quantity,
          inStock: product.inStock
        };
        cart.push(cartItem);
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));
      navigate('/cart');
    }
  };

  /**
   * Handles the "Buy Now" action
   * Navigates directly to checkout with the current product
   */
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

  /**
   * Toggles product in wishlist
   * Requires user to be logged in
   */
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
      // Refetch wishlist IDs after update
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

  /**
   * Submits a new product review
   * @param {Event} e - Form submit event
   */
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
    if (!product?._id) {
      alert('Product not loaded. Please try again.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const username = localStorage.getItem('username') || 'Guest User';
      
      const response = await axios.post(`${BASE_URL}/reviews`, {
        productId: product._id,
        user: username,
        rating,
        title: reviewTitle,
        comment: reviewContent
      });
      
      if (response.status === 201) {
        // Refresh both reviews and product data after successful submission
        const [reviewsRes, summaryRes, productRes] = await Promise.all([
          axios.get(`${BASE_URL}/reviews/${product._id}`),
          axios.get(`${BASE_URL}/reviews/summary/${product._id}`),
          axios.get(`${BASE_URL}/products/${product._id}`)
        ]);
        
        setReviews(reviewsRes.data);
        setReviewSummary(summaryRes.data);
        
        // Update product with new average rating
        const updatedProduct = {
          ...productRes.data.data,
          images: (productRes.data.data.images || []).map(img => img.startsWith('http') ? img : `${BASE_URL}/${img}`)
        };
        setProduct(updatedProduct);
        
        // Reset form
        setRating(0);
        setReviewTitle('');
        setReviewContent('');
        alert('Thank you for your review!');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(`Failed to submit review: ${err.response?.data?.message || 'Please try again.'}`);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  /**
   * Handles liking a review
   * @param {string} reviewId - ID of the review to like
   */
  const handleLikeReview = async (reviewId) => {
    try {
      const username = localStorage.getItem('username') || 'Guest User';
      
      await axios.post(`${BASE_URL}/reviews/like/${reviewId}`, {
        user: username
      });
      
      // Refresh reviews after like
      const reviewsRes = await axios.get(`${BASE_URL}/reviews/${product._id}`);
      setReviews(reviewsRes.data);
    } catch (err) {
      console.error('Error liking review:', err);
    }
  };

  /**
   * Adds a reply to a review
   * @param {string} reviewId - ID of the review to reply to
   */
  const handleAddReply = async (reviewId) => {
    try {
      const username = localStorage.getItem('username') || 'Guest User';
      
      await axios.post(`${BASE_URL}/reviews/reply/${reviewId}`, {
        user: username,
        comment: replyContent
      });
      
      // Refresh reviews after adding reply
      const reviewsRes = await axios.get(`${BASE_URL}/reviews/${product._id}`);
      setReviews(reviewsRes.data);
      setReplyingTo(null);
      setReplyContent('');
    } catch (err) {
      console.error('Error adding reply:', err);
    }
  };

  // Helper functions

  /**
   * Formats date to relative time or readable format
   * @param {string} dateString - Date string to format
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
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
  };

  /**
   * Calculates rating distribution percentages
   * @returns {Object} Percentage distribution for each star rating
   */
  const calculateRatingDistribution = () => {
    const total = reviewSummary.totalReviews || 1;
    return {
      5: Math.round((reviewSummary.breakdown[5] / total) * 100),
      4: Math.round((reviewSummary.breakdown[4] / total) * 100),
      3: Math.round((reviewSummary.breakdown[3] / total) * 100),
      2: Math.round((reviewSummary.breakdown[2] / total) * 100),
      1: Math.round((reviewSummary.breakdown[1] / total) * 100)
    };
  };

  const ratingDistribution = calculateRatingDistribution();

  /**
   * Toggles between showing all reviews or just the first one
   */
  const toggleShowAllReviews = () => {
    setShowAllReviews(!showAllReviews);
  };

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

  // Main product page render
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
          {/* Main product section with images and details */}
          <div className={styles.productMain}>
            {/* Image Gallery Section */}
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
                {/* Navigation buttons for multiple images */}
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

            {/* Product Details Section */}
            <div className={styles.productDetails}>
              <div className={styles.ratingFavoriteContainer}>
                <RatingStars 
                  productId={product._id} 
                  rating={product.averageRating || product.rating} 
                  size="large" 
                />
                <button
                  className={styles.favoriteButtonTop}
                  onClick={handleWishlistToggle}
                  aria-label="Toggle favorite"
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

              {/* Color Selector */}
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

              {/* Size Selector */}
              {product.sizes?.length > 0 && (
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

              {/* Quantity Selector */}
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

          {/* Product Tabs Navigation */}
          <div className={styles.tabsContainer}>
            <div className={styles.productTabs}>
              <button
                className={`${styles.tab} ${activeTab === 'description' ? styles.active : ''}`}
                onClick={() => handleTabChange('description')}
              >
                Description
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'reviews' ? styles.active : ''}`}
                onClick={() => handleTabChange('reviews')}
              >
                Reviews
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'returns' ? styles.active : ''}`}
                onClick={() => handleTabChange('returns')}
              >
                Returns
              </button>
            </div>
          </div>

          {/* Tab Content - Only show the active tab */}
          <div className={styles.tabContentContainer}>
            {/* Description Tab Content */}
            {activeTab === 'description' && (
              <div className={styles.tabContent}>
                <div className={styles.productDescription}>
                  <h2>Product Description</h2>
                  <p>{product.description}</p>
                </div>
              </div>
            )}

            {/* Reviews Tab Content */}
            {activeTab === 'reviews' && (
              <div className={styles.tabContent}>
                <section className={styles.reviewContent}>
                  {/* Review Summary Section */}
                  <div className={styles.feedbackHeader}>
                    <h3>Product Rating</h3>
                    <div className={styles.feedbackSummary}>
                      <div className={styles.averageRatingBox}>
                        <div className={styles.averageRating}>{reviewSummary.averageRating.toFixed(1)}</div>
                        <div className={styles.ratingStars1}>
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={i < Math.floor(reviewSummary.averageRating) ? `${styles.star} ${styles.filled}` : styles.star}
                            />
                          ))}
                        </div>
                        <div className={styles.totalReviews}>{reviewSummary.totalReviews} reviews</div>
                      </div>
                      <div className={styles.ratingDistribution}>
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className={styles.ratingRow}>
                            <div className={styles.percentage}>{ratingDistribution[stars]}%</div>
                            <div className={styles.ratingBar}>
                              <div
                                style={{ width: `${ratingDistribution[stars]}%` }}
                                className={styles.ratingProgress}
                              ></div>
                            </div>
                            <div className={styles.stars}>
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={i < stars ? `${styles.star} ${styles.filled}` : styles.star}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Reviews List Section */}
                  <div className={styles.reviewsSection}>
                    <h3>Reviews ({reviewSummary.totalReviews})</h3>
                    {isLoadingReviews ? (
                      <div className={styles.loadingReviews}>
                        <div className={styles.loadingSpinner}></div>
                        <p>Loading reviews...</p>
                      </div>
                    ) : reviews.length === 0 ? (
                      <p className={styles.noReviews}>No reviews yet. Be the first to review!</p>
                    ) : (
                      <>
                        {/* Show reviews (all or just first depending on state) */}
                        {reviews.slice(0, showAllReviews ? reviews.length : 1).map((review) => (
                          <article key={review._id} className={styles.reviewCard}>
                            <div className={styles.reviewHeader}>
                              <div className={styles.userInitial}>{review.user?.charAt(0) || 'U'}</div>
                              <div className={styles.userDetails}>
                                <div className={styles.userNameAndRating}>
                                  <span className={styles.userName}>{review.user || 'Anonymous'}</span>
                                  <div className={styles.reviewRating}>
                                    {[...Array(5)].map((_, i) => (
                                      <FaStar
                                        key={i}
                                        className={i < review.rating ? `${styles.star} ${styles.filled}` : styles.star}
                                      />
                                    ))}
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
                                  review.likes?.includes('currentUser') ? styles.liked : ''
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

                            {/* Reply Form (shown when replying) */}
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

                            {/* Replies List */}
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

                        {/* Show More/Less Reviews Button */}
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

                  {/* Add Review Form */}
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
            )}

            {/* Returns Tab Content */}
            {activeTab === 'returns' && (
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
            )}
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
