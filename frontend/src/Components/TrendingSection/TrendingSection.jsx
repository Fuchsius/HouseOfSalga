import React from 'react'
import './TrendingSection.css'
import Image1 from '../../Assets/Image1.png'
import Image2 from '../../Assets/Image2.png'
import Image3 from '../../Assets/Image3.png'

const products = [
  { id: 1, image: Image1, title: "Cotton A Line Kurta", price: "Rs.4000.00" },
  { id: 2, image: Image2, title: "Cotton A Line Kurta", price: "Rs.4000.00" },
  { id: 3, image: Image3, title: "Cotton A Line Kurta", price: "Rs.4000.00" },
];


const TrendingSection = () => {
  return (
    <div>
    <section className="trending-section">
      <h2><span className="bold">Trending  </span> Collections</h2>
      <div className="card-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.title} className="product-img" />
            <h3>{product.title}</h3>
            <p className="price">Price: {product.price}</p>
            <div className="heart-icon">♡</div>
          </div>
        ))}
      </div>
      
    </section>
    <div className="freedom-banner">
      <span className="freedom-text">FREEDOM OVER ENYTHING</span>
      <span className="freedom-icon">★</span>
    </div>
    </div>
    
  )
}

export default TrendingSection
