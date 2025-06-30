import React, { useState, useEffect } from 'react';
import './EmptyWishlist.css';
import {
  FaRegHeart,
  FaHeart,
  FaStar,
  FaStarHalfAlt,
  FaTimes
} from 'react-icons/fa';


export default function EmptyWishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hearted, setHearted] = useState({}); // Track hearted state per item

  // Fetch wishlist items from backend
  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/wishlist');
        if (!response.ok) {
          throw new Error('Failed to fetch wishlist items');
        }
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching wishlist items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlistItems();
  }, []);

  // Remove item from wishlist
  const removeFromWishlist = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/wishlist/${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove item from wishlist');
      }
      setItems(items.filter(item => item._id !== itemId));
    } catch (err) {
      setError(err.message);
      console.error('Error removing item from wishlist:', err);
    }
  };

  // Clear the entire list
  const handleClear = async () => {
    for (const item of items) {
      await removeFromWishlist(item._id);
    }
  };

  if (loading) {
    return <div className="wishlist-page"><p>Loading wishlist...</p></div>;
  }

  if (error) {
    return <div className="wishlist-page"><p className="error-text">Error: {error}</p></div>;
  }

  return (
    <div>
     <Header />
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
            const isHearted = hearted[product._id] ?? true; // Default to true (since it's wishlist)
            const HeartIcon = isHearted ? FaHeart : FaRegHeart;
            return (
              <div className="wishlist-card" key={product._id} style={{ position: 'relative' }}>
                {/* X mark for delete, centered on top border */}
                <FaTimes
                  className="delete-x-icon"
                  style={{
                    color: '#000',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    opacity: 0.5,
                    transition: 'opacity 0.2s',
                    fontSize: '0.9rem',
                    background: '#fff',
                    borderRadius: '50%',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                  }}
                  title="Delete"
                  onClick={() => removeFromWishlist(product._id)}
                  onMouseOver={e => (e.currentTarget.style.opacity = 1)}
                  onMouseOut={e => (e.currentTarget.style.opacity = 0.5)}
                />
                <img src={product.image} alt={product.title} />
               
                <HeartIcon
                  className="card-heart-icon"
                  style={{ color: isHearted ? '#ff2b2b' : '#aaa', cursor: 'pointer' }}
                  onClick={() => setHearted(h => ({ ...h, [product._id]: !isHearted }))}
                />
                <h4>{product.title}</h4>
                <p>Rs {product.price?.toFixed ? product.price.toFixed(2) : product.price}</p>
               
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
<Footer /></div>
  );
}

