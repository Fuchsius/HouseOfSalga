import React from 'react'
import './ConfirmOrder.css'

const ConfirmOrder = () => {
  return (
    
    <div className="order-success-container">
      <div className="order-success-content">
        <div className="success-icon">&#10003;</div>
        <h2>Your order is successfully place</h2>
        <p>
          Thank you for your purchase! We truly appreciate your support and are thrilled to have you as a valued customer.
          Your order is being processed, we'll ensure it reaches you promptly. If you have any questions feel free to reach out.
          Thanks again for choosing us!
        </p>
        <div className="button-group">
          <button className="shop-btn">Go to shopping</button>
          <button className="view-order-btn">View Order</button>
        </div>
      </div>
    </div>
      
  
  )
}

export default ConfirmOrder;
