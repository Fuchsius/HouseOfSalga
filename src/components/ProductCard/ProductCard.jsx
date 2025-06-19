import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import RatingStars from '../RatingStars/RatingStars';
import './ProductCard.css';

const ProductCard = ({ product, variant = 'small' }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e) => {
    e.stopPropagation(); 
    setIsFavorite((prev) => !prev);
  };

  return (
    <div className={`product-card ${variant}`}>
      <div className="product-image-container">
        <img
          src={`/images/product/${product.id}.png`}
          alt={product.name}
          className="product-img"
        />
        <button
          className="favorite-button"
          onClick={toggleFavorite}
          aria-label="Toggle favorite"
        >
          {isFavorite ? <FaHeart className="filled" /> : <FaRegHeart />}
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">Rs. {product.price.toFixed(2)}</div>
        <div className="rating-container">
          <RatingStars rating={product.rating} />
          <span className="review-count">({product.reviewCount || 0})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
