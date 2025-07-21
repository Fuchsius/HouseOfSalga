import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import RatingStars from '../RatingStars/RatingStars';
import { useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';

const BASE_URL = 'http://localhost:5000/api';
const WISHLIST_URL = `${BASE_URL}/wishlist`;
const REVIEW_SUMMARY_URL = `${BASE_URL}/reviews/summary`;

const ProductCard = ({ product, variant = 'small' }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [liveRating, setLiveRating] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!product?._id) return;

    const fetchRating = async () => {
      try {
        const res = await fetch(`${REVIEW_SUMMARY_URL}/${product._id}`);
        if (res.ok) {
          const summary = await res.json();
          setLiveRating(summary?.averageRating || product.averageRating || product.rating);
        }
      } catch (err) {
        console.error('Failed to fetch review summary:', err);
      }
    };

    fetchRating();
  }, [product?._id]);

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

      // Fetch updated wishlist
      const updated = await fetch(`${WISHLIST_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.ok ? res.json() : null);

      if (!updated) return;
      const updatedIds = updated?.products?.map(p => p._id) || [];
      setWishlistIds(updatedIds);
      setIsFavorite(updatedIds.includes(product._id));

      // ✅ Dispatch safe wishlist-updated event with detail
      window.dispatchEvent(new CustomEvent('wishlist-updated', {
        detail: {
          count: updatedIds.length,
          products: updated.products
        }
      }));
    } catch (err) {
      alert('Network error while updating wishlist.');
    }
  };

  const handleClick = () => {
    const productId = product._id || product.id;
    if (!productId) {
      console.error('Product ID is undefined!', product);
      return;
    }
    navigate(`/product/${productId}`);
  };

  if (!product || typeof product !== 'object') {
    return null;
  }

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

      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <div className={styles.productPrice}>Rs. {product.price?.toFixed(2)}</div>

        <div className={styles.ratingContainer}>
          <RatingStars
            rating={liveRating ?? product.averageRating ?? product.rating}
            reviewCount={product.reviewCount}
          />
        </div>

        <button
          className={styles.addToCartButton}
          onClick={async (e) => {
            e.stopPropagation();
            const token = localStorage.getItem('token');
            const size = Array.isArray(product.sizes) ? product.sizes[0] : (product.size || 'M');
            const color = Array.isArray(product.colors) ? product.colors[0] : (product.color || 'Default');

            if (token) {
              try {
                const response = await fetch(`${BASE_URL}/cart/add`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    productId: product._id || product.id,
                    quantity: 1,
                    size,
                    color
                  })
                });

                if (!response.ok) {
                  const error = await response.json();
                  alert(error.message || 'Failed to add to cart');
                  return;
                }

                alert('Added to cart!');
                window.dispatchEvent(new Event('cart-updated'));
              } catch (err) {
                alert('Network error while adding to cart.');
              }
            } else {
              // Guest cart
              let cart = JSON.parse(localStorage.getItem('cart') || '[]');
              const existingIndex = cart.findIndex(item =>
                (item._id || item.id) === (product._id || product.id) &&
                (item.size || item.selectedSize) === size &&
                (item.color || item.selectedColor) === color
              );

              if (existingIndex !== -1) {
                cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
              } else {
                cart.push({
                  ...product,
                  size,
                  color,
                  quantity: 1
                });
              }

              localStorage.setItem('cart', JSON.stringify(cart));
              alert('Added to cart!');
              window.dispatchEvent(new Event('cart-updated'));
            }
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
