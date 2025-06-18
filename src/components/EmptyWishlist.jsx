import React from 'react';
import '../styles/EmptyWishlist.css';
import {
  FaRegHeart, FaHeart, FaStar, FaStarHalfAlt, FaRegStar,
  FaUser, FaBoxOpen, FaBell, FaSignOutAlt
} from 'react-icons/fa';

const products = [
  { name: 'Black Pant', price: 'Rs 2500.00', image: '/assets/images/black-pant.png' },
  { name: 'Winter Jersey', price: 'Rs 3500.00', image: '/assets/images/winter-jersey.png' },
  { name: 'Over Coat', price: 'Rs 8000.00', image: '/assets/images/over-coat.png' },
  { name: 'Summer dress', price: 'Rs 4500.00', image: '/assets/images/summer-dress.png' },
  { name: 'Full kit', price: 'Rs 9000.00', image: '/assets/images/full-kit.png' },
];

const EmptyWishlist = () => {
  return (
    <div className="wishlist-container page-padding">
      <div className="breadcrumb">Home &gt; My Account &gt; <strong>My Info</strong></div>
      <h2>Hello Amanda,</h2>
      <p className="welcome-text">Welcome to your account</p>

      <div className="main-layout">
        <aside className="sidebar">
          <ul>
            <li><FaUser /> Personal Information</li>
            <li><FaBoxOpen /> My Orders</li>
            <li className="active"><FaHeart /> My Wishlists</li>
            <li><FaBell /> Notifications</li>
            <li><FaSignOutAlt /> Sign Out</li>
          </ul>
        </aside>

        <div className="wishlist-box">
            <div className="wishlist-heart-circle">
            <FaRegHeart className="wishlist-heart-icon" />
            </div>
            
          <h3>Your wishlist is empty.</h3>
          <p>You don’t have any products in the wishlist yet. You will find a lot of interesting products on our Shop page.</p>
          <button>Continue Shopping</button>
        </div>
      </div>

      <div className="recently-viewed">
        <h3>Recently Viewed</h3>
        <div className="product-list">
          {products.map((product, index) => (
            <div className="product-card" key={index}>
              <img src={product.image} alt={product.name} />
              <FaRegHeart className="card-heart-icon" />
              <h4>{product.name}</h4>
              <p>{product.price}</p>
              <div className="rating">
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
                <FaStarHalfAlt className="star-icon" />
                <span>(121)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyWishlist;
