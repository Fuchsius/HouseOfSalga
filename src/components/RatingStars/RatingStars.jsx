import React from 'react';
import './RatingStars.css'; 

const RatingStars = ({ rating = 0, reviewCount, size = 'medium' }) => {
  const clampedRating = Math.min(Math.max(Number(rating) || 0, 0), 5);
  const fullStars = Math.floor(clampedRating);
  const hasHalfStar = clampedRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    
    <div className={`rating-stars ${size}`}> {/* Check if this class applies */}
      <div className="stars-container">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star full">★</span>
        ))}
        {hasHalfStar && (
          <span key="half" className="star half">
            <span className="half-filled">★</span>
            <span className="half-empty">★</span>
          </span>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="star empty">★</span>
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="review-count">({reviewCount})</span>
      )}
    </div>
  );
};

export default RatingStars;