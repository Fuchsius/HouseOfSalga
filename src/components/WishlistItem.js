import React from 'react';
import './WishlistItem.css';

const WishlistItem = ({ image, title, size, color, price, onAddToCart, onRemove }) => {
  return (
    <div className="wishlist-item">
      <img src={image} alt={title} className="wishlist-image" />
      
      <div className="wishlist-details">
        <div className="wishlist-title">{title}</div>
        <div className="wishlist-text">
          <span><strong>Size:</strong> {size}</span>
          <span><strong>Color:</strong> {color}</span>
        </div>
      </div>
      


      <div className="wishlist-price">Rs.{price}</div>

      <button className="wishlist-add-btn" onClick={onAddToCart}>
        Add to cart
      </button>

      <button className="wishlist-remove" onClick={onRemove}>×</button>
    </div>
  );
};

export default WishlistItem;
