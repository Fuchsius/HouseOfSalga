import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './wishlistpage.css';

// Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import Sidebar from '../../Components/Sidebar/Sidebar';
import ProductCard from '../../Components/ProductCard/ProductCard';

// Icons
import { FaRegHeart, FaStarHalfStroke, FaStar as FaStarSolid } from 'react-icons/fa6';

// API endpoints (update base URL if needed)
const BASE_URL = 'http://localhost:5000/api';
const WISHLIST_URL = `${BASE_URL}/wishlist`;
const RECENTLY_VIEWED_URL = `${BASE_URL}/recentlyview`;

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;
    fetch(`${WISHLIST_URL}/user/${userId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setWishlist(data?.products?.filter(Boolean) || []));
  }, [userId]);

  useEffect(() => {
    // Fetch recently viewed from localStorage
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentlyViewed(recentlyViewed);
  }, []);

  const handleAddToCart = (index) => {
    const item = wishlist[index];
    navigate('/cart', {
      state: { product: { ...item, quantity: 1 } },
    });
  };

  const handleRemove = async (index) => {
    if (!userId) return alert('No userId found. Please log in again.');
    const productId = wishlist[index]._id;
    try {
      const response = await fetch(`${WISHLIST_URL}/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        return alert(`Failed to remove: ${error.error || response.statusText}`);
      }

      // Refresh wishlist
      const res = await fetch(`${WISHLIST_URL}/user/${userId}`);
      const data = await res.json();
      setWishlist(data?.products?.filter(Boolean) || []);
    } catch (err) {
      console.error(err);
      alert('Network error while removing item.');
    }
  };

  const handleAddToWishlist = async (product) => {
    if (!userId) return alert('Please log in first.');
    if (!product?._id) return alert('Invalid product.');

    const wishlistIds = wishlist.map(item => String(item._id));
    if (wishlistIds.includes(String(product._id))) {
      return alert('Already in wishlist!');
    }

    try {
      const response = await fetch(`${WISHLIST_URL}/${product._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        return alert(`Failed to add: ${error.error || response.statusText}`);
      }

      // Refresh wishlist
      const res = await fetch(`${WISHLIST_URL}/user/${userId}`);
      const data = await res.json();
      setWishlist(data?.products?.filter(Boolean) || []);
    } catch (err) {
      console.error(err);
      alert('Network error while adding to wishlist.');
    }
  };

  return (
    <div>
      <Header />

      <div className="wishlist-container page-padding">
        <div className="main-layout">
          <Sidebar />

          <div className="wishlist-content">
            {wishlist.length === 0 ? (
              <div className="wishlist-box">
                <div className="wishlist-heart-circle">
                  <FaRegHeart className="wishlist-heart-icon" />
                </div>
                <h3>Your wishlist is empty.</h3>
                <p>Browse our shop to find products you'll love.</p>
                <button onClick={() => navigate('/shop')}>Continue Shopping</button>
              </div>
            ) : (
              <>
                <h2>My Wishlist</h2>
                {wishlist.map((item, index) => (
                  <div className="wishlist-item" key={item._id || index}>
                    <img
                      src={item?.image}
                      alt={item?.name}
                      className="wishlist-image"
                    />
                    <div className="wishlist-details">
                      <div className="wishlist-title">{item?.name}</div>
                      <div className="wishlist-text">
                        <span><strong>Size:</strong> {item?.size}</span>
                        <span><strong>Color:</strong> {item?.color}</span>
                      </div>
                    </div>
                    <div className="wishlist-price">
                      Rs. {item?.price?.toLocaleString?.() ?? item.price}
                    </div>
                    <button
                      className="wishlist-add-btn"
                      onClick={() => handleAddToCart(index)}
                    >
                      Add to cart
                    </button>
                    <button
                      className="wishlist-remove"
                      onClick={() => handleRemove(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="recently-viewed">
          <h3>Recently Viewed</h3>
          <div className="product-list" style={{ overflowX: 'auto', display: 'flex', gap: '24px', paddingBottom: '8px' }}>
            {recentlyViewed.length === 0 ? (
              <p>No recently viewed products.</p>
            ) : (
              recentlyViewed.map((product, index) => (
                <ProductCard key={product._id || index} product={{
                  ...product,
                  images: [product.image],
                  averageRating: product.averageRating || 4.5, // fallback
                  reviewCount: product.reviewCount || 121 // fallback
                }} variant="small" />
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
