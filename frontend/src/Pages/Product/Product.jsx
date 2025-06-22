import React, { useState } from 'react';
import {
  FaShoppingCart,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaShoppingBag,
  FaRegHeart
} from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../../Components/ProductCard/ProductCard';
import RatingStars from '../../Components/RatingStars/RatingStars';
import ProductTabs from '../../Components/ProductTabs/ProductTabs'; 
import Image3 from '../../Assets/Image3.png';
import Image2 from '../../Assets/Image2.png';
import Image1 from '../../Assets/Image1.png';
import R1 from '../../Assets/R1.png';
import R2 from '../../Assets/R2.png';
import R3 from '../../Assets/R3.png';
import R4 from '../../Assets/R4.png';
import visa from '../../Assets/1.png';
import pay from '../../Assets/2.png';
import './Product.css';
import Footer from '../../Components/Footer/Footer'
import Header from '../../Components/Header/Header'

const Product = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const defaultProduct = {
    id: 1,
    name: 'Noah Yellow overcoat',
    price: 5000.0,
    inStock: true,
    colors: ['orange', 'red', 'black'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    images: [Image3, Image2, Image1],
    description: 'This is a stylish Noah Yellow Overcoat designed with bold black and gray accents, adding a modern edge to its vibrant yellow base. Perfect for colder seasons, it blends functionality with high fashion. The product offers a variety of sizes and color choices.',
    rating: 4.5,
    reviewCount: 18
  };

  const product = location.state?.product || defaultProduct;

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'orange');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const recommendedProducts = [
    { 
      id: 2, 
      name: 'Black Pim', 
      price: 2500.0, 
      rating: 4, 
      reviewCount: 5,
      image: Image1
    },
    { 
      id: 3, 
      name: 'Winter Jersey', 
      price: 500.0, 
      rating: 5, 
      reviewCount: 12,
      image: R1
    },
    { 
      id: 4, 
      name: 'Over Coal', 
      price: 10000.0, 
      rating: 4.5, 
      reviewCount: 8,
      image: R2
    },
    { 
      id: 5, 
      name: 'Summer dress', 
      price: 1500.0, 
      rating: 3.5, 
      reviewCount: 3,
      image: R3
    },
    { 
      id: 6, 
      name: 'Full kit', 
      price: 9000.0, 
      rating: 5, 
      reviewCount: 15,
      image: R4
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleAddToCart = () => {
    navigate('/cart', {
      state: {
        product: {
          ...product,
          selectedSize,
          selectedColor,
          quantity
        }
      }
    });
  };

  const handleBuyNow = () => {
    navigate('/checkout', {
      state: {
        product: {
          ...product,
          selectedSize,
          selectedColor,
          quantity
        }
      }
    });
  };

  return (
    <div>
      <Header />
    <div className="product-page">
      <div className="product-container">
        <div className="product-main">
          {/* Image Gallery Section */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="product-main-img"
                onError={(e) => {
                  console.error('Failed to load main image:', product.images[currentImageIndex]);
                }}
              />
              <button className="nav-button prev" onClick={prevImage}>
                <FaChevronLeft />
              </button>
              <button className="nav-button next" onClick={nextImage}>
                <FaChevronRight />
              </button>
            </div>
            <div className="image-dots-container">
              {product.images.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${currentImageIndex === index ? 'dot-active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="product-details">
            <div className="rating-favorite-container">
              <RatingStars rating={product.rating} size="large" />
              <button
                className="favorite-button-top"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                {isFavorite ? <FaHeart className="filled" /> : <FaRegHeart />}
              </button>
            </div>

            <h1 className="product-title">{product.name}</h1>
            <a href="#!" className="view-saves">
              View including taxes
            </a>

            <div className="price-stock">
              <span className="product-page-price">Rs. {product.price.toFixed(2)}</span>
              <span className="stock">{product.inStock ? 'In stock' : 'Out of stock'}</span>
            </div>

            <hr className="divider" />

            {/* Color Selector */}
            <div className="color-selector">
              <span className="color-label">Color: {selectedColor}</span>
              <div className="color-options">
                {product.colors.map((color) => (
                  <div
                    key={color}
                    className={`color-option-wrapper ${
                      selectedColor === color ? 'color-option-wrapper-selected' : ''
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    <div
                      className="color-option"
                      style={{
                        backgroundColor: color.toLowerCase()
                      }}
                      aria-label={color}
                    />
                  </div>
                ))}
              </div>
            </div>

            <hr className="divider" />

            {/* Size Selector */}
            <div className="size-selector">
              <span className="size-label">Size: {selectedSize}</span>
              <div className="size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'size-option-selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Control */}
            <div className="quantity-control">
              <div className="quantity-selector">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span aria-live="polite">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="product-actions">
              <button className="add-to-cart" onClick={handleAddToCart}>
                <FaShoppingCart /> Add To Cart
              </button>
              <button className="buy-now" onClick={handleBuyNow}>
                <FaShoppingBag /> Buy Now
              </button>
            </div>

            {/* Secure Checkout */}
            <div className="secure-checkout">
              <div className="secure-icons">
                <img
                  src= {visa}
                  alt= "Secure Payment"
                />
                <img
                  src= {pay}
                  alt= "Secure Payment"
                />
              </div>
              <p>Guarantee safe & secure checkout</p>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="tabs-section">
          <ProductTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="product-description">
                <h2>Product Description</h2>
                <p>{product.description}</p>
              </div>
            )}
            {activeTab === 'review' && (
              <div>
                <h2>Customer Reviews</h2>
                <p>No reviews yet.</p>
              </div>
            )}
            {activeTab === 'returns' && (
              <div>
                <h2>Returns & Exchanges</h2>
                <p>Returns accepted within 30 days of purchase.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Products */}
        <div className="recommended-products">
          <h2>Recommended</h2>
          <p className="subtitle">You might want to take a look at these.</p>
          <div className="product-grid">
            {recommendedProducts.map((p) => (
              <ProductCard key={p.id} product={p} variant="small" />
            ))}
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default Product;