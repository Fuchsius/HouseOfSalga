import React, { useEffect, useState } from 'react';
import './TrendingSection.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TrendingSection = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch trending products from backend
  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/trending');

        const updatedProducts = response.data
          // Add /images/ prefix to image filenames
          .map(product => ({
            ...product,
            images: product.images.map(img => {
              if (typeof img !== 'string') {
                console.warn('Invalid image path:', img);
                return '';
              }
              if (img.startsWith('http') || img.startsWith('/images/')) {
                return img;
              }
              return `/images/${img}`;
            })
          }))
          // Sort by newest first
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          // Take only the first 3 products
          .slice(0, 3);

        setProducts(updatedProducts);
        setLoading(false);
      } catch (err) {
        setError('Failed to load trending products');
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  const handleClick = (product) => {
    navigate('/product', { state: { product } });
  };

  if (loading) return <p>Loading trending products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="trending-section-wrapper">
      <section className="trending-section-main">
        <h2 className="trending-section-title">
          <span className="trending-section-bold">Trending</span> Collections
        </h2>
        <div className="trending-card-grid">
          {products.map(product => (
            <div
              key={product._id}
              className="trending-product-card"
              onClick={() => handleClick(product)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="trending-product-img"
              />
              <h3 className="trending-product-title">{product.name}</h3>
              <p className="trending-product-price">Price: Rs. {product.price.toFixed(2)}</p>
              <div className="trending-heart-icon">♡</div>
            </div>
          ))}
        </div>
      </section>

      <div className="trending-freedom-banner">
        <span className="trending-freedom-text">FREEDOM OVER ANYTHING</span>
        <span className="trending-freedom-icon">★</span>
      </div>
    </div>
  );
};

export default TrendingSection;
