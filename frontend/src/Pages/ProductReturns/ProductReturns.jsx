import React from 'react';

const ProductReturns = () => {
  return (
    <div className="returns-content">
      <h2>RETURN</h2>
      <div className="returns-policy-section">
        <p>
          Our dispatch head time is 7 working days for orders that include both ready-to-strip 
          and made-on-order pieces. If you would like the ready-to-strip pieces to be dispatched 
          early, please mention in the NOTES section of checkout.
        </p>
        <p>
          Returns must be initiated within 3 days of delivery. Returns include exchange of size, 
          style or credit note only.
        </p>
        <p>
          COD, returns and exchanges are not possible on customized garments.
        </p>
      </div>

      <h2>SHIPPING</h2>
      <div className="returns-policy-section">
        <p>Enjoy free shipping on all orders.</p>
      </div>
    </div>
  );
};

export default ProductReturns;
