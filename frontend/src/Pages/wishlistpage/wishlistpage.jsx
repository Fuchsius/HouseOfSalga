import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './wishlistpage.css';

// ✅ Header & Footer imports
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';

import Sidebar from '../../Components/Sidebar/Sidebar';

import {
  FaRegHeart,
  FaStarHalfStroke,
  FaStar as FaStarSolid,
} from 'react-icons/fa6';

import blackPant from '../../images/black-pant.png';
import winterJersey from '../../images/winter-jersey.png';
import overCoat from '../../images/over-coat.png';
import summerDress from '../../images/summer-dress.png';
import fullKit from '../../images/full-kit.png';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(stored);
    // Listen for localStorage changes (e.g., from other tabs or pages)
    const handleStorage = (event) => {
      if (event.key === 'wishlist') {
        const updated = JSON.parse(event.newValue || '[]');
        setWishlist(updated);
      }
    };
    window.addEventListener('storage', handleStorage);
    // Listen for custom wishlist change events in the same tab
    const handleCustomWishlistChange = () => {
      const updated = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlist(updated);
    };
    window.addEventListener('wishlistChanged', handleCustomWishlistChange);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('wishlistChanged', handleCustomWishlistChange);
    };
  }, []);

  // Fetch recently viewed products from backend
  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/recentlyview');
        if (!response.ok) throw new Error('Failed to fetch recently viewed');
        const data = await response.json();
        setRecentlyViewed(data);
      } catch (err) {
        setRecentlyViewed([]);
      }
    };
    fetchRecentlyViewed();
  }, []);

  // Redirect to /emptywishlist if wishlist is empty
 
  const handleAddToCart = (index) => {
    const item = wishlist[index];
    navigate('/cart', {
      state: {
        product: {
          ...item,
          // Add any additional fields needed for the cart page
          quantity: 1,
        },
      },
    });
  };

  const handleRemove = (index) => {
    const updated = [...wishlist];
    updated.splice(index, 1);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    setWishlist(updated);
  };

  const handleAddTestProduct = () => {
    const testProduct = {
      name: "Test Product",
      price: 1999,
      image: "https://via.placeholder.com/150",
      size: "M",
      color: "Red"
    };
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist.push(testProduct);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    setWishlist(wishlist);
  };

  const handleAddToWishlist = (product) => {
    // Get current wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    // Check if product is already in wishlist
    const exists = wishlist.some(item => item._id === product._id || item.name === product.name);
    if (!exists) {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setWishlist(wishlist);
      // Optionally, show a message or toast here
    }
  };

  return (
    <div>
      <Header /> {/* ✅ Header added */}

      <button onClick={handleAddTestProduct} style={{margin: '20px', padding: '10px 20px'}}>Add Test Product to Wishlist</button>

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
                <p>
                  You don't have any products in the wishlist yet. You will
                  find a lot of interesting products on our Shop page.
                </p>
                <button>Continue Shopping</button>
              </div>
            ) : (
              <>
                <h2>My Wishlist</h2>
                {wishlist.map((item, index) => (
                  <div className="wishlist-item" key={index}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="wishlist-image"
                    />
                    <div className="wishlist-details">
                      <div className="wishlist-title">{item.name}</div>
                      <div className="wishlist-text">
                        <span>
                          <strong>Size:</strong> {item.size}
                        </span>
                        <span>
                          <strong>Color:</strong> {item.color}
                        </span>
                      </div>
                    </div>
                    <div className="wishlist-price">Rs.{item.price?.toLocaleString?.() ?? item.price}</div>
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
          <div className="product-list">
            {recentlyViewed.length === 0 ? (
              <p>No recently viewed products.</p>
            ) : (
              recentlyViewed.map((product, index) => (
                <div className="product-card" key={product._id || index}>
                  <img src={product.image} alt={product.title || product.name} />
                  <FaRegHeart
                    className="card-heart-icon"
                    onClick={() => handleAddToWishlist(product)}
                    style={{ cursor: 'pointer' }}
                  />
                  <h4>{product.title || product.name}</h4>
                  <p>Rs {product.price}</p>
                  <div className="rating">
                    <FaStarSolid className="star-icon" />
                    <FaStarSolid className="star-icon" />
                    <FaStarSolid className="star-icon" />
                    <FaStarSolid className="star-icon" />
                    <FaStarHalfStroke className="star-icon" />
                    <span>(121)</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer /> {/* ✅ Footer added */}
    </div>
  );
};

export default Wishlist;
