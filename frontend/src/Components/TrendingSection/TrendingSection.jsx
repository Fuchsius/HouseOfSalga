// import React from 'react'
// import './TrendingSection.css'
// import Image1 from '../../Assets/Image1.png'
// import Image2 from '../../Assets/Image2.png'
// import Image3 from '../../Assets/Image3.png'

// const products = [
//   { id: 1, image: Image1, title: "Cotton A Line Kurta", price: "Rs.4000.00" },
//   { id: 2, image: Image2, title: "Cotton A Line Kurta", price: "Rs.4000.00" },
//   { id: 3, image: Image3, title: "Cotton A Line Kurta", price: "Rs.4000.00" },
// ];


// const TrendingSection = () => {
//   return (
//     <div>
//     <section className="trending-section">
//       <h2><span className="bold">Trending  </span> Collections</h2>
//       <div className="card-grid">
//         {products.map(product => (
//           <div key={product.id} className="product-card">
//             <img src={product.image} alt={product.title} className="product-img" />
//             <h3>{product.title}</h3>
//             <p className="price">Price: {product.price}</p>
//             <div className="heart-icon">♡</div>
//           </div>
//         ))}
//       </div>
      
//     </section>
//     <div className="freedom-banner">
//       <span className="freedom-text">FREEDOM OVER ENYTHING</span>
//       <span className="freedom-icon">★</span>
//     </div>
//     </div>
    
//   )
// }

// export default TrendingSection
import React from 'react';
import './TrendingSection.css';
import Image1 from '../../Assets/Image1.png';
import Image2 from '../../Assets/Image2.png';
import Image3 from '../../Assets/Image3.png';
import { useNavigate } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: "Cotton A Line Kurta",
    price: 4000.00,
    inStock: true,
    colors: ['red', 'blue', 'green'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [Image1],
    rating: 4.2,
    reviewCount: 10,
    description: "A comfortable cotton A-line kurta perfect for casual wear. Made from premium quality cotton fabric, this kurta offers excellent breathability and comfort. The A-line silhouette provides a flattering fit for all body types while maintaining a traditional yet contemporary look.",
    returnsPolicy: "Returns accepted within 30 days of purchase. Exchange of size and style available."
  },
  {
    id: 2,
    name: "Premium Cotton Kurta",
    price: 4000.00,
    inStock: true,
    colors: ['green', 'black', 'white'],
    sizes: ['S', 'M', 'L'],
    images: [Image2],
    rating: 4.0,
    reviewCount: 8,
    description: "Stylish and breathable cotton kurta for daily use. This premium kurta features intricate detailing and superior stitching quality. Perfect for both casual outings and semi-formal occasions, offering comfort without compromising on style.",
    returnsPolicy: "Returns accepted within 30 days of purchase. Exchange of size and style available."
  },
  {
    id: 3,
    name: "Designer Cotton Kurta",
    price: 4000.00,
    inStock: true,
    colors: ['yellow', 'orange', 'pink'],
    sizes: ['M', 'L', 'XL'],
    images: [Image3],
    rating: 4.5,
    reviewCount: 12,
    description: "Elegant A-line kurta crafted for comfort and elegance. This designer piece combines traditional craftsmanship with modern aesthetics. The vibrant colors and premium cotton fabric make it a perfect choice for festive occasions and everyday wear.",
    returnsPolicy: "Returns accepted within 30 days of purchase. Exchange of size and style available."
  }
];

const TrendingSection = () => {
  const navigate = useNavigate();

  const handleClick = (product) => {
    navigate('/product', { state: { product } });
  };

  return (
    <div>
      <section className="trending-section">
        <h2><span className="bold">Trending</span> Collections</h2>
        <div className="card-grid">
          {products.map(product => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleClick(product)}
              style={{ cursor: 'pointer' }}
            >
              <img src={product.images[0]} alt={product.name} className="product-img" />
              <h3>{product.name}</h3>
              <p className="price">Price: Rs. {product.price.toFixed(2)}</p>
              <div className="heart-icon">♡</div>
            </div>
          ))}
        </div>
      </section>
      
      <div className="freedom-banner">
        <span className="freedom-text">FREEDOM OVER ANYTHING</span>
        <span className="freedom-icon">★</span>
      </div>
    </div>
  );
};

export default TrendingSection;