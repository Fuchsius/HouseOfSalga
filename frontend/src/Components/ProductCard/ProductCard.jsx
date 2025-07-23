// import React, { useState, useEffect } from 'react';
// import { FaHeart, FaRegHeart } from 'react-icons/fa';
// import RatingStars from '../RatingStars/RatingStars';
// import { useNavigate } from 'react-router-dom';
// import styles from './ProductCard.module.css';

// const BASE_URL = 'http://localhost:5000/api';
// const WISHLIST_URL = `${BASE_URL}/wishlist`;

// const ProductCard = ({ product, variant = 'small' }) => {
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [wishlistIds, setWishlistIds] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) return;
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
//         setIsFavorite(ids.includes(product?._id));
//       });
//   }, [product?._id]);

//   if (!product || typeof product !== 'object') {
//     return null;
//   }

//   const handleWishlistToggle = async (e) => {
//     e.stopPropagation();
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
//       window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { count: updatedIds.length } }));
//     } catch (err) {
//       alert('Network error while updating wishlist.');
//     }
//   };

//   const handleClick = () => {
//     const productId = product._id || product.id;
//     if (!productId) {
//       console.error('Product ID is undefined!', product);
//       return;
//     }
//     navigate(`/product/${productId}`);
//   };

//   return (
//     <div
//       className={`${styles.productCard} ${styles[variant] || ''}`}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       onClick={handleClick}
//       style={{ cursor: 'pointer' }}
//       role="button"
//       tabIndex={0}
//       onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}
//     >
//       <div className={styles.productImageContainer}>
//         <img
//           src={product.images?.[0] || '/images/placeholder.png'}
//           alt={product.name}
//           className={`${styles.productImg} ${isHovered ? styles.hoverScale : ''}`}
//         />
//         <button
//           className={`${styles.favoriteButton} ${isHovered ? styles.buttonPop : ''}`}
//           onClick={handleWishlistToggle}
//           aria-label="Toggle favorite"
//         >
//           {isFavorite ? <FaHeart className={styles.filled} /> : <FaRegHeart />}
//         </button>
//       </div>
//       <div className={styles.productInfo}>
//         <h3 className={styles.productName}>{product.name}</h3>
//         <div className={styles.productPrice}>Rs. {product.price?.toFixed(2)}</div>

//         <div className={styles.ratingContainer}>
//           <RatingStars rating={product.averageRating ?? product.rating} reviewCount={product.reviewCount} />
//         </div>
//         <button
//           className={styles.addToCartButton}
//           onClick={(e) => {
//             e.stopPropagation();
//             handleClick();
//           }}
//         >
//           View
//         </button>
//       </div>
//     </div>
//   );
// };
// export default ProductCard;
import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import RatingStars from '../RatingStars/RatingStars';
import { useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';

// API endpoints
const BASE_URL = 'http://localhost:5000/api';
const WISHLIST_URL = `${BASE_URL}/wishlist`;
const REVIEW_SUMMARY_URL = `${BASE_URL}/reviews/summary`;

/**
 * ProductCard Component
 * Displays a product card with image, name, price, rating, and wishlist functionality.
 * @param {Object} props - Component props
 * @param {Object} props.product - Product object to display
 * @param {string} [props.variant='small'] - Optional size variant
 */
const ProductCard = ({ product, variant = 'small' }) => {
  // Local state
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [ratingData, setRatingData] = useState({
    averageRating: product.averageRating ?? product.rating ?? 0,
    reviewCount: product.reviewCount ?? 0
  });

  const navigate = useNavigate();

  // Fetch wishlist product IDs for the current user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

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
        setIsFavorite(ids.includes(product?._id));
      });
  }, [product?._id]);

  // Fetch average rating and review count for the product
  useEffect(() => {
    if (!product?._id) return;

    const fetchRatingSummary = async () => {
      try {
        const response = await fetch(`${REVIEW_SUMMARY_URL}/${product._id}`);
        if (response.ok) {
          const data = await response.json();
          setRatingData({
            averageRating: data.averageRating || 0,
            reviewCount: data.reviewCount || 0
          });
        }
      } catch (error) {
        console.error('Error fetching rating summary:', error);
      }
    };

    fetchRatingSummary();
  }, [product?._id]);

  // Handle wishlist add/remove toggle
  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
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

      // Refresh wishlist after change
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

  // Navigate to the product detail page
  const handleClick = () => {
    const productId = product._id || product.id;
    if (!productId) {
      console.error('Product ID is undefined!', product);
      return;
    }
    navigate(`/product/${productId}`);
  };

  // Return null if product data is invalid
  if (!product || typeof product !== 'object') {
    return null;
  }

  // Render component
  return (
    <div
      className={`${styles.productCard} ${styles[variant] || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}
    >
      {/* Product image and favorite button */}
      <div className={styles.productImageContainer}>
        <img
          src={product.images?.[0] || '/images/placeholder.png'}
          alt={product.name}
          className={`${styles.productImg} ${isHovered ? styles.hoverScale : ''}`}
        />
        <button
          className={`${styles.favoriteButton} ${isHovered ? styles.buttonPop : ''}`}
          onClick={handleWishlistToggle}
          aria-label="Toggle favorite"
        >
          {isFavorite ? <FaHeart className={styles.filled} /> : <FaRegHeart />}
        </button>
      </div>

      {/* Product information */}
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <div className={styles.productPrice}>Rs. {product.price?.toFixed(2)}</div>

        {/* Rating stars */}
        <div className={styles.ratingContainer}>
          <RatingStars rating={ratingData.averageRating} reviewCount={ratingData.reviewCount} />
        </div>

        {/* View button */}
        <button
          className={styles.addToCartButton}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          View
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

