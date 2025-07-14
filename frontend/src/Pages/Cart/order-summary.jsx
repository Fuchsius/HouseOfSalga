import { useState } from "react";
import Currency from "./currency";
import DiscountCodeInput from "./discount-code";
import CheckoutModal from "./checkout";
import ToastNotification from "./toast-notification";
import { useCurrency } from "./useCurrency";
import "./order-summary.css";

export default function OrderSummary({
  subtotal,
  tax,
  deliveryFee,
  total,
  loading,
  itemCount = 0,
}) {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const {
    selectedCurrency,
    handleCurrencyChange,
    formatPrice,
    currencySymbol,
  } = useCurrency();

  const handleCheckout = () => {
    if (itemCount === 0) {
      setCheckoutMessage("Your Cart is empty! Add some items first.");
      setShowToast(true);
      return;
    }

    if (total < 500) {
      setCheckoutMessage("Minimum order amount is Rs.500");
      setShowToast(true);
      return;
    }

    setCheckoutMessage("🎉 Great choice! Your order is ready for checkout.");
    setShowCheckoutModal(true);
  };

  return (
    <>
      <div className="order-summary">
        <div className="currency-row">
          <Currency
            selectedCurrency={selectedCurrency}
            onCurrencyChange={handleCurrencyChange}
          />
        </div>

        <h2 className="summary-title">Order Summary</h2>

        <div className="summary-section">
          <div className="summary-row">
            <span className="label">Subtotal</span>
            <span className="value">{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span className="label">Including Tax</span>
            <span className="value">{formatPrice(tax)}</span>
          </div>
          <div className="summary-row">
            <span className="label">Delivery Fee</span>
            <span className="value">{formatPrice(deliveryFee)}</span>
          </div>



          <div className="summary-total">
            <span className="total-label">Total</span>
            <span className="total-value">{formatPrice(total)}</span>
          </div>
        </div>



        <button
          onClick={handleCheckout}
          className="checkout-btn"
          disabled={loading}
        >
          {loading ? "Processing..." : "Go to Checkout"}
        </button>

        <div className="info-text">
          🔒 Secure checkout • 📦 Free delivery on orders above {currencySymbol}
          2000
        </div>
      </div>

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        cartTotal={total}
        itemCount={itemCount}
        subtotal={subtotal}
        tax={tax}
        deliveryFee={deliveryFee}
      />

      {showToast && (
        <ToastNotification
          message={checkoutMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}
