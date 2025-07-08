import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import RatingStars from '../RatingStars/RatingStars';
import { useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';

const ProductCard = ({ product, variant = 'small' }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Check if this product is in the wishlist
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsFavorite(wishlist.some(item => item._id === product?._id));
  }, [product]);

  const toggleFavorite = (e) => {
    e.stopPropagation(); // Prevent card click when toggling favorite
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (isFavorite) {
      wishlist = wishlist.filter(item => item._id !== product._id);
    } else {
      wishlist.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        // Optionally add more fields if needed
      });
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new Event('wishlistChanged'));
  };

  const handleClick = () => {
    const productId = product._id || product.id;
    if (!productId) {
      console.error('Product ID is undefined!', product);
      return;
    }
    navigate(`/product/${productId}`);
  };

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
          onClick={toggleFavorite}
          aria-label="Toggle favorite"
        >
          {isFavorite ? <FaHeart className={styles.filled} /> : <FaRegHeart />}
        </button>
      </div>
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <div className={styles.productPrice}>Rs. {product.price?.toFixed(2)}</div>
        <div className={styles.ratingContainer}>
          <RatingStars rating={product.averageRating ?? product.rating} reviewCount={product.reviewCount} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
