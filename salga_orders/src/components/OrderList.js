/* src/components/OrderList.js */
import React from "react";
import orders from "../data/mockOrders";
import "./OrderList.css";

export default function OrderList({ selectedStatus, searchQuery }) {
  const results = orders.filter(
    (o) =>
      o.status === selectedStatus &&
      (o.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="orders-section">
      {results.length ? (
        results.map((o) => (
          <div key={o.id}>
            {/* ── White box: Order summary only ── */}
          { o.status === "In Process" && (
  <div className="order-card">
    <div className="order-top-row">
      <p className="order-id">Order no: #{o.id}</p>
      <div className={`order-dates ${o.status === "In Process" ? "default-font" : ""}`}>
        <p>
          Order Date : {new Date(o.date).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        </p>
        <p>Estimated Delivery Date : {new Date(o.deliveryDate).toLocaleDateString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric'
        })}</p>
      </div>
    </div>
  </div>
)}



            {/* ── Below: No white box ── */}
            <div className="order-details">
              <div className="product-row">
               <div className="image-wrapper">
    <img
      src={o.image || o.productImage || "https://via.placeholder.com/80"}
      alt={o.productName}
      className="product-image"
    />
  </div>


                <div className="product-details">
                  <h4 className="product-name">{o.productName}</h4>
                  <p><span className="label">Size</span>: {o.size}</p>
                  <p><span className="label">Color</span>: {o.color}</p>
                  <p><span className="label">Quantity</span>: {o.qty}</p>
                </div>

  <div className="order-cta-wrapper">
  <div className="order-price-block">
    <p className="order-price">Rs.{o.price?.toFixed(2)}</p>
  </div>

  <div className="order-cta">
    <button className="continue-btn">Continue Shopping</button>
    {o.status === "In Process" && (
  <button className="track-btn">Track Order</button>
)}
{o.status === "Completed" && (
  <button className="track-btn">Write a Review</button>
)}
{o.status === "Cancelled" && (
  <button className="track-btn">Buy Now</button>
)}

  </div>
</div>


              </div>

              <div className="status-line">
  <span className={`status-badge ${o.status.toLowerCase().replace(/\s+/g, '-')}`}>
    {o.status}
  </span>
  <span className="status-message">{o.message}</span>
</div>

            </div>

            <hr className="order-divider" />
          </div>
        ))
      ) : (
        <p className="no-orders">No orders found.</p>
      )}
    </div>
  );
}
