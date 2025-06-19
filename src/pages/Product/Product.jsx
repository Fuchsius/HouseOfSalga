import React, { useState } from 'react';
import {
  FaShoppingCart,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaShoppingBag,
  FaRegHeart
} from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import RatingStars from '../../components/RatingStars/RatingStars';
import ProductTabs from '../../components/ProductTabs/ProductTabs';
import styles from './Product.module.css';

const Product = () => {
  const location = useLocation();

  const defaultProduct = {
    id: 1,
    name: 'Noah Yellow overcoat',
    price: 5000.0,
    inStock: true,
    colors: ['orange', 'red', 'Black'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    images: [
      '/images/product/1.png',
      '/images/products/1-alt1.jpg',
      '/images/products/1-alt2.jpg'
    ],
    description: 'This is a stylish Noah Yellow Overcoat designed with bold black and gray accents, adding a modern edge to its vibrant yellow base. Perfect for colder seasons, it blends functionality with high fashion. The product offers a variety of sizes (XS, S, M, L) and color choices.',
    rating: 4.5,
    reviewCount: 18
  };

  const product = location.state?.product || defaultProduct;

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[1] || 'Red');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const recommendedProducts = [
    { id: 2, name: 'Black Pim', price: 2500.0, rating: 4, reviewCount: 5 },
    { id: 3, name: 'Winter Jersey', price: 500.0, rating: 5, reviewCount: 12 },
    { id: 4, name: 'Over Coal', price: 10000.0, rating: 4.5, reviewCount: 8 },
    { id: 5, name: 'Summer dress', price: 1500.0, rating: 3.5, reviewCount: 3 },
    { id: 6, name: 'Full kit', price: 9000.0, rating: 5, reviewCount: 15 }
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

  return (
    <div className={styles.productPage}>
      <div className={styles.productContainer}>
        <div className={styles.productMain}>
          {/* Image Gallery */}
          <div className={styles.productImages}>
            <div className={styles.mainImage}>
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className={styles.productMainImg}
              />
              <button className={`${styles.navButton} ${styles.prev}`} onClick={prevImage}>
                <FaChevronLeft />
              </button>
              <button className={`${styles.navButton} ${styles.next}`} onClick={nextImage}>
                <FaChevronRight />
              </button>
            </div>
            <div className={styles.imageDotsContainer}>
              {product.images.map((_, index) => (
                <span
                  key={index}
                  className={`${styles.dot} ${currentImageIndex === index ? styles.dotActive : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className={styles.productDetails}>
            <div className={styles.ratingFavoriteContainer}>
              <RatingStars rating={product.rating} size="large" />
              <button
                className={styles.favoriteButtonTop}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                {isFavorite ? <FaHeart className={styles.filled} /> : <FaRegHeart />}
              </button>
            </div>

            <h1 className={styles.productTitle}>{product.name}</h1>
            <a href="#!" className={styles.viewSaves}>
              View including taxes
            </a>

            <div className={styles.priceStock}>
              <span className={styles.price}>Rs. {product.price.toFixed(2)}</span>
              <span className={styles.stock}>{product.inStock ? 'In stock' : 'Out of stock'}</span>
            </div>

            <hr className={styles.divider} />

            {/* Color Selector */}
            <div className={styles.colorSelector}>
              <span className={styles.colorLabel}>Color: {selectedColor}</span>
              <div className={styles.colorOptions}>
                {product.colors.map((color) => (
                  <div
                    key={color}
                    className={`${styles.colorOptionWrapper} ${
                      selectedColor === color ? styles.colorOptionWrapperSelected : ''
                    }`}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      borderColor: selectedColor === color ? color.toLowerCase() : undefined
                    }}
                  >
                    <div
                      className={styles.colorOption}
                      style={{
                        backgroundColor: color.toLowerCase(),
                        borderColor: color.toLowerCase()
                      }}
                      aria-label={color}
                    />
                  </div>
                ))}
              </div>
            </div>

            <hr className={styles.divider} />

            {/* Size Selector */}
            <div className={styles.sizeSelector}>
              <span>Size: {selectedSize}</span>
              <div className={styles.sizeOptions}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`${styles.sizeOption} ${selectedSize === size ? styles.sizeOptionSelected : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.quantityControl}>
              <div className={styles.quantitySelector}>
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
            
            <div className={styles.productActions}>
              <button className={styles.addToCart}>
                <FaShoppingCart /> Add To Cart
              </button>
              <button className={styles.buyNow}>
                <FaShoppingBag /> Buy Now
              </button>
            </div>

            <div className={styles.secureCheckout}>
              <div className={styles.secureIcons}>
                <img
                  src="/images/product/trustbag.png"
                  alt="Secure Payment"
                />
              </div>
              <p>Guarantee safe & secure checkout</p>
            </div>
          </div>
        </div>

        {/* Tabs and In-page Content */}
        <div className={styles.tabsSection}>
          <ProductTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className={styles.tabContent}>
            {activeTab === 'description' && (
              <div className={styles.productDescription}>
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

        {/* Recommended */}
        <div className={styles.recommendedProducts}>
          <h3>Recommended</h3>
          <p className={styles.subtitle}>You might want to take a look at these.</p>
          <div className={styles.productGrid}>
            {recommendedProducts.map((p) => (
              <ProductCard key={p.id} product={p} variant="small" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;