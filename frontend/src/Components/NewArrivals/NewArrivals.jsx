// 
import React from 'react';
import './NewArrivals.css';
import { useNavigate } from 'react-router-dom';
import product1 from '../../Assets/product1.png';
import product2 from '../../Assets/product2.png';
import product3 from '../../Assets/product3.png';
import product4 from '../../Assets/product4.png';
import product5 from '../../Assets/product5.png';
import product6 from '../../Assets/product6.png';
import product7 from '../../Assets/product7.png';
import product8 from '../../Assets/product8.png';

const products = [
  {
    id: 1,
    name: 'Tailored Jacket',
    image: product1,
    price: 3500.0,
    rating: 5.0,
    inStock: true,
    sizes: ['S', 'M', 'L'],
    colors: ['black', 'navy'],
    images: [product1],
    description: 'Premium tailored jacket for a sophisticated look.'
  },
  {
    id: 2,
    name: 'Tailored Jacket',
    image: product2,
    price: 4100.0,
    rating: 5.0,
    inStock: true,
    sizes: ['S', 'M', 'L'],
    colors: ['gray', 'blue'],
    images: [product2],
    description: 'Classic jacket for formal and casual settings.'
  },
  {
    id: 3,
    name: 'Tailored Jacket',
    image: product3,
    price: 4000.0,
    rating: 5.0,
    inStock: true,
    sizes: ['S', 'M', 'L'],
    colors: ['olive', 'beige'],
    images: [product3],
    description: 'Comfortable and trendy tailored jacket.'
  },
  {
    id: 4,
    name: 'Tailored Jacket',
    image: product4,
    price: 2500.0,
    rating: 5.0,
    inStock: true,
    sizes: ['S', 'M', 'L'],
    colors: ['brown', 'khaki'],
    images: [product4],
    description: 'Affordable, lightweight jacket for everyday use.'
  },
  {
    id: 5,
    name: 'Tailored Jacket',
    image: product5,
    price: 3550.0,
    rating: 5.0,
    inStock: true,
    sizes: ['S', 'M', 'L'],
    colors: ['black', 'red'],
    images: [product5],
    description: 'Stylish tailored jacket with a sleek cut.'
  },
  {
    id: 6,
    name: 'Tailored Jacket',
    image: product6,
    price: 4000.0,
    rating: 5.0,
    inStock: true,
    sizes: ['S', 'M', 'L'],
    colors: ['navy', 'gray'],
    images: [product6],
    description: 'Modern tailored jacket, perfect for layering.'
  },
  {
    id: 7,
    name: 'Tailored Jacket',
    image: product7,
    price: 3000.0,
    rating: 5.0,
    inStock: true,
    sizes: ['S', 'M', 'L'],
    colors: ['green', 'black'],
    images: [product7],
    description: 'A versatile jacket for any wardrobe.'
  },
  {
    id: 8,
    name: 'Tailored Jacket',
    image: product8,
    price: 5000.0,
    rating: 5.0,
    inStock: true,
    sizes: ['S', 'M', 'L'],
    colors: ['gray', 'white'],
    images: [product8],
    description: 'Top-quality tailored jacket with superior fabric.'
  }
];

const NewArrivals = () => {
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    navigate('/product', { state: { product } });
  };

  return (
    <div>
      <section className="new-arrivals-section" id="new-arrivals">
        <div className="new-arrivals-container">
          <h2 className="new-arrivals-title">
            New <span className="new-arrivals-span">Arrivals</span>
          </h2>

          <div className="products-grid1">
            {products.map((product) => (
              <div
                key={product.id}
                className="product-card1"
                onClick={() => handleProductClick(product)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="new-arrivals-product-image"
                />
                <div className="new-arrivals-product-details">
                  <p className="new-arrivals-product-name">{product.name}</p>
                  <div className="new-arrivals-product-meta">
                    <span className="new-arrivals-product-price">Rs. {product.price.toFixed(2)}</span>
                    <span className="new-arrivals-divider">|</span>
                    <span className="new-arrivals-product-rating">{product.rating}</span>
                    <span className="new-arrivals-star">★</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="new-arrivals-load-more-button">Load More</button>
        </div>
      </section>
    </div>
  );
};

export default NewArrivals;
