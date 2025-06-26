import React, { useState } from 'react';
import ProductCard from '../../Components/ProductCard/ProductCard';
import Footer from '../../Components/Footer/Footer';
import Header from '../../Components/Header/Header';

import './Shop.css';
import S1 from '../../Assets/S1.png';
import R1 from '../../Assets/R1.png';
import R2 from '../../Assets/R2.png';
import R3 from '../../Assets/R3.png';
import R4 from '../../Assets/R4.png';

// --- ProductFilters Component ---
const ProductFilters = () => {
  const [priceRange, setPriceRange] = useState(1000);
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    size: [],
    color: null,
  });

  const colors = ['#00ff00', '#ff0000', '#ffff00', '#ffa500', '#00ffff', '#0000ff', '#800080', '#ff69b4', '#ffffff', '#000000'];

  const handleFilterChange = (type, value) => {
    if (type === 'color') {
      setSelectedFilters(prev => ({
        ...prev,
        color: prev.color === value ? null : value
      }));
    } else {
      setSelectedFilters(prev => ({
        ...prev,
        [type]: prev[type].includes(value)
          ? prev[type].filter(item => item !== value)
          : [...prev[type], value]
      }));
    }
  };

  const applyFilters = () => {
    console.log("Applying Filters:", {
      priceRange: { min: 500, max: priceRange },
      filters: selectedFilters,
    });
  };

  return (
    <div className="sidebar">
      <div className="filter-header">
        <h2>FILTERS</h2>
        <span className="filter-icon">
          <div className="icon-line"></div>
          <div className="icon-line"></div>
          <div className="icon-line"></div>
        </span>
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <div className="filter-title">PRICES</div>
        <div className="price-range">
          <div className="price-display">
            <span>Rs. 500</span>
            <span>Rs. {priceRange}</span>
          </div>
          <input
            type="range"
            min="500"
            max="8000"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="range-slider"
          />
        </div>
      </div>

      {/* Category */}
      <div className="filter-section">
        <div className="filter-title">FILTERS</div>
        <div className="filter-group">
          {['Women', 'Ladies'].map(item => (
            <div key={item} className="checkbox-item">
              <input
                type="checkbox"
                id={item}
                checked={selectedFilters.category.includes(item)}
                onChange={() => handleFilterChange('category', item)}
              />
              <label htmlFor={item}>{item}</label>
            </div>
          ))}
        </div>

        {/* Size */}
        <div className="filter-title size-title">SIZE</div>
        <div className="filter-group">
          {['Small', 'Medium', 'Large', 'Extra Large'].map(item => (
            <div key={item} className="checkbox-item">
              <input
                type="checkbox"
                id={item}
                checked={selectedFilters.size.includes(item)}
                onChange={() => handleFilterChange('size', item)}
              />
              <label htmlFor={item}>{item}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="filter-section">
        <div className="filter-title">Colors</div>
        <div className="color-filters">
          {colors.map((color, index) => (
            <div
              key={index}
              className={`color-circle ${selectedFilters.color === color ? 'selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleFilterChange('color', color)}
            >
              {selectedFilters.color === color && (
                <svg className="check-icon" viewBox="0 0 24 24">
                  <path fill="#fff" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      <button className="apply-btn" onClick={applyFilters}>
        Apply Filter
      </button>
    </div>
  );
};

// --- ShopPage Component ---
const ShopPage = () => {
  const [sortBy, setSortBy] = useState('default');

  const products = [
    {
      id: 1,
      name: 'Black Tops',
      price: 2500.0,
      rating: 4,
      reviews: 124,
      image: S1,
    },
    {
      id: 2,
      name: 'Winter Jacket',
      price: 5500.0,
      rating: 5,
      reviews: 89,
      image: R1,
    },
    {
      id: 3,
      name: 'Blue Coat',
      price: 8000.0,
      rating: 4,
      reviews: 156,
      image: R2,
    },
    {
      id: 4,
      name: 'Blue Coat',
      price: 8000.0,
      rating: 4,
      reviews: 156,
      image: R3,
    },
    {
      id: 5,
      name: 'Blue Coat',
      price: 8000.0,
      rating: 4,
      reviews: 156,
      image: R4,
    },
  ];

  return (
    <>
      <Header />
      <div className="shop-container">
        <ProductFilters />

        <div className="main-content">
          <div className="content-header">
            <div className="breadcrumb">
              Showing (1-12) of 120 Products - Sort by
            </div>
            <div className="sort-dropdown">
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="pagination">
            <button className="page-btn">←</button>
            {[1, 2, 3, 4, 5, 6].map(n => (
              <button key={n} className={`page-btn ${n === 1 ? 'active' : ''}`}>{n}</button>
            ))}
            <button className="page-btn">→</button>
          </div>

          <div className="footer-features">
            <div className="feature">
              <div className="feature-icon">🏆</div>
              <div>
                <div className="feature-text">High Quality</div>
                <div className="feature-subtext">crafted from top materials</div>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <div>
                <div className="feature-text">Warranty Protection</div>
                <div className="feature-subtext">Over 2 years</div>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">🚚</div>
              <div>
                <div className="feature-text">Free Delivery</div>
                <div className="feature-subtext">Order over Rs. 15000</div>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">📞</div>
              <div>
                <div className="feature-text">24 / 7 Support</div>
                <div className="feature-subtext">Dedicated support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShopPage;
