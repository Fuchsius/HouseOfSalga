import React, { useState } from 'react';

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
import wishlist1 from '../../images/wishlist1.png';
import wishlist2 from '../../images/wishlist2.png';
import wishlist3 from '../../images/wishlist3.png';
import wishlist4 from '../../images/wishlist4.png';

const recentlyViewed = [
  { name: 'Black Pant', price: 'Rs 2500.00', image: blackPant },
  { name: 'Winter Jersey', price: 'Rs 3500.00', image: winterJersey },
  { name: 'Over Coat', price: 'Rs 8000.00', image: overCoat },
  { name: 'Summer dress', price: 'Rs 4500.00', image: summerDress },
  { name: 'Full kit', price: 'Rs 9000.00', image: fullKit },
];

const initialWishlist = [
  {
    image: wishlist1,
    title: 'Classic Top',
    size: 'small',
    color: 'Blue',
    price: 'Rs.2500.00',
  },
  {
    image: wishlist2,
    title: 'Classic Top',
    size: 'small',
    color: 'Blue',
    price: 'Rs.3500.00',
  },
  {
    image: wishlist3,
    title: 'Classic Top',
    size: 'small',
    color: 'Blue',
    price: 'Rs.9000.00',
  },
  {
    image: wishlist4,
    title: 'Classic Top',
    size: 'small',
    color: 'Blue',
    price: 'Rs.4500.00',
  },
];

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(initialWishlist);

  const handleAddToCart = (index) => {
    console.log('Add to cart:', wishlist[index]);
  };

  const handleRemove = (index) => {
    const updated = [...wishlist];
    updated.splice(index, 1);
    setWishlist(updated);
  };

  return (
    <div>
      <Header /> {/* ✅ Header added */}

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
                  You don’t have any products in the wishlist yet. You will
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
                      alt={item.title}
                      className="wishlist-image"
                    />
                    <div className="wishlist-details">
                      <div className="wishlist-title">{item.title}</div>
                      <div className="wishlist-text">
                        <span>
                          <strong>Size:</strong> {item.size}
                        </span>
                        <span>
                          <strong>Color:</strong> {item.color}
                        </span>
                      </div>
                    </div>
                    <div className="wishlist-price">{item.price}</div>
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
            {recentlyViewed.map((product, index) => (
              <div className="product-card" key={index}>
                <img src={product.image} alt={product.name} />
                <FaRegHeart className="card-heart-icon" />
                <h4>{product.name}</h4>
                <p>{product.price}</p>
                <div className="rating">
                  <FaStarSolid className="star-icon" />
                  <FaStarSolid className="star-icon" />
                  <FaStarSolid className="star-icon" />
                  <FaStarSolid className="star-icon" />
                  <FaStarHalfStroke className="star-icon" />
                  <span>(121)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer /> {/* ✅ Footer added */}
    </div>
  );
};

export default Wishlist;
