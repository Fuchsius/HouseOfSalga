import React, { useState } from 'react';
import '../styles/EmptyWishlist.css';
import {
  FaRegHeart,
  FaHeart,
  FaStar,
  FaStarHalfAlt,
} from 'react-icons/fa';

/* ------------------------------------------------------------------ */
/*  Initial data – add more items or fetch from API as needed          */
/* ------------------------------------------------------------------ */
const defaultProducts = [
  {
    name: 'Black Pant',
    price: 'Rs 2500.00',
    image: '/assets/images/black-pant.png',
    liked: false,
  },
  {
    name: 'Winter Jersey',
    price: 'Rs 3500.00',
    image: '/assets/images/winter-jersey.png',
    liked: false,
  },
  {
    name: 'Over Coat',
    price: 'Rs 8000.00',
    image: '/assets/images/over-coat.png',
    liked: false,
  },
  {
    name: 'Summer dress',
    price: 'Rs 4500.00',
    image: '/assets/images/summer-dress.png',
    liked: false,
  },
  {
    name: 'Full kit',
    price: 'Rs 9000.00',
    image: '/assets/images/full-kit.png',
    liked: false,
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export default function EmptyWishlist() {
  const [items, setItems] = useState(defaultProducts);

  /* Clear the entire list */
  const handleClear = () => setItems([]);

  /* Toggle single product’s liked state */
  const toggleLike = (index) => {
    const updated = [...items];
    updated[index].liked = !updated[index].liked;
    setItems(updated);
  };

  return (
    <div className="wishlist-page">
      {/* Breadcrumb + Clear List button (top‑row) */}
      <div className="wishlist-header">
        <div className="breadcrumb">
  <a href="/" className="breadcrumb-link">Home</a>
  &nbsp;&gt;&nbsp;
  <button
    type="button"
    className="breadcrumb-link active"
    onClick={() => window.location.reload()}
  >
    Shop
  </button>
</div>

        {/* Hide the button once list is empty */}
        {items.length > 0 && (
          <button className="clear-link" onClick={handleClear}>
            Clear List
          </button>
        )}
      </div>

      {/* Section title */}
      <h2>My wishlist</h2>

      {/* Render either the grid or empty notice */}
      {items.length === 0 ? (
        <p className="empty-text">Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-grid">
          {items.map((product, idx) => {
            const HeartIcon = product.liked ? FaHeart : FaRegHeart; // filled icon if liked
            return (
              <div className="wishlist-card" key={idx}>
                <img src={product.image} alt={product.name} />

                {/* Heart – toggles red on click */}
                <HeartIcon
                  className="card-heart-icon"
                  style={{ color: product.liked ? '#ff2b2b' : '#b2b1e9' }}
                  onClick={() => toggleLike(idx)}
                />

                <h4>{product.name}</h4>
                <p>{product.price}</p>

                {/* Star rating row */}
                <div className="rating">
                  <FaStar className="star-icon" />
                  <FaStar className="star-icon" />
                  <FaStar className="star-icon" />
                  <FaStar className="star-icon" />
                  <FaStarHalfAlt className="star-icon" />
                  <span>(121)</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
