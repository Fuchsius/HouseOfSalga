import React, { useEffect, useState } from 'react';
import './NewArrivals.css';
import { useNavigate } from 'react-router-dom';

const NewArrivals = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Prevents "go-come-go" flickering

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products/new-arrivals');
        const data = await res.json();

        if (data.success && data.data) {
          setProducts(data.data);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    // Navigate using the product ID in the URL path
    navigate(`/product/${product._id}`);
  };

  return (
    <div>
      <section className="new-arrivals-section" id="new-arrivals">
        <div className="new-arrivals-container">
          <h2 className="new-arrivals-title">
            New <span className="new-arrivals-span">Arrivals</span>
          </h2>

          {!loading && (
            <div className="products-grid1">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="product-card1"
                  onClick={() => handleProductClick(product)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0] : ''}
                    alt={product.name}
                    className="new-arrivals-product-image"
                  />
                  <div className="new-arrivals-product-details">
                    <p className="new-arrivals-product-name">{product.name}</p>
                    <div className="new-arrivals-product-meta">
                      <span className="new-arrivals-product-price">
                        Rs. {product.price?.toFixed(2)}
                      </span>
                      <span className="new-arrivals-divider">|</span>
                      <span className="new-arrivals-product-rating">
                        {product.rating || 5.0}
                      </span>
                      <span className="new-arrivals-star">★</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && (
            <button className="new-arrivals-load-more-button">Load More</button>
          )}
        </div>
      </section>
    </div>
  );
};

export default NewArrivals;
