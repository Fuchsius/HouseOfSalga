import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import RatingStars from '../RatingStars/RatingStars';
import './ProductCard.css';

const ProductCard = ({ product, variant = 'default' }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    // Navigate to product detail page or handle card click
    console.log('Product clicked:', product.name);
  };

  return (
    <div 
      className={`recommended-card ${variant === 'small' ? 'recommended-card-small' : ''}`}
      onClick={handleCardClick}
    >
      <div className="recommended-image-container">
        <img 
          src={product.image} 
          alt={product.name}
          className="recommended-image"
          onError={(e) => {
            e.target.src = '/images/product/placeholder.jpg'; // Fallback image
          }}
        />
        <button 
          className="recommended-favorite-btn"
          onClick={handleFavoriteClick}
        >
          {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        </button>
      </div>
      
      <div className="recommended-info">
        <h3 className="recommended-name">{product.name}</h3>
        <p className="recommended-price">Rs. {product.price.toFixed(2)}</p>
        <div className="recommended-rating">
          <RatingStars rating={product.rating} size="small" />
          <span className="recommended-review-count"></span>
        </div>
        
      </div>
    </div>
  );
};

export default ProductCard;