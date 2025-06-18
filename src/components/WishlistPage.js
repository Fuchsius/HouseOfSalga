import React from 'react';
import Sidebar from './Sidebar';
import WishlistItem from './WishlistItem';
import './styles/WishlistPage.css';

const wishlistData = [
  {
    image: require('../assets/images/wishlist1.png'),
    title: 'Classic Top',
    size: 'small',
    color: 'Blue',
    price: 'Rs.2500.00'
  },
  {
    image: require('../assets/images/wishlist2.png'),
    title: 'Classic Top',
    size: 'small',
    color: 'Blue',
    price: 'Rs.3500.00'
  },
  {
    image: require('../assets/images/wishlist3.png'),
    title: 'Classic Top',
    size: 'small',
    color: 'Blue',
    price: 'Rs.9000.00'
  },
  {
    image: require('../assets/images/wishlist4.png'),
    title: 'Classic Top',
    size: 'small',
    color: 'Blue',
    price: 'Rs.4500.00'
  }
];

function WishlistPage() {
  return (
    <div className="wishlist-page">
      <Sidebar />
      <div className="wishlist-content">
        <h2>My Wishlist</h2>
        {wishlistData.map((item, index) => (
          <WishlistItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
}

export default WishlistPage;
