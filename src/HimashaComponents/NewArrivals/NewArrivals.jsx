import React from 'react'
import './NewArrivals.css'
import product1 from '../../HimashaAssets/product1.png'
import product2 from '../../HimashaAssets/product2.png'
import product3 from '../../HimashaAssets/product3.png'
import product4 from '../../HimashaAssets/product4.png'
import product5 from '../../HimashaAssets/product5.png'
import product6 from '../../HimashaAssets/product6.png'
import product7 from '../../HimashaAssets/product7.png'
import product8 from '../../HimashaAssets/product8.png'

const products = [
  { id: 1, image: product1, price: "Rs. 3500.00" },
  { id: 2, image: product2, price: "Rs. 4100.00" },
  { id: 3, image: product3, price: "Rs. 4000.00" },
  { id: 4, image: product4, price: "Rs. 2500.00" },
  { id: 5, image: product5, price: "Rs. 3550.00" },
  { id: 6, image: product6, price: "Rs. 4000.00" },
  { id: 7, image: product7, price: "Rs. 3000.00" },
  { id: 8, image: product8, price: "Rs. 5000.00" },
];

const NewArrivals = () => {
  return (
    <div>
      <section className="new-arrivals-section" id="new-arrivals">
      <div className="container">
        <h2 className="section-title">
          New <span>Arrivals</span>
        </h2>
        <div className="products-grid1">
          {products.map((product) => (
            <div key={product.id} className="product-card1">
              <img
                src={product.image}
                alt="Tailored Jacket"
                className="product-image"
              />
              <div className="product-details">
                <p className="product-name">Tailored Jacket</p>
                <div className="product-meta">
                  <span className="product-price">{product.price}</span>
                  <span className="divider">|</span>
                  <span className="product-rating">5.0</span>
                  <span className="star">★</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="load-more-button">Load More</button>
      </div>
    </section>
      
    </div>
  )
}

export default NewArrivals
