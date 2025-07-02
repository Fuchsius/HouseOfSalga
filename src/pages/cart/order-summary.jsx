import { useState } from "react";
import Currency from "./currency";
import DiscountCodeInput from "./discount-code";
import CheckoutModal from "./checkout";
import ToastNotification from "./toast-notification";
import { useCurrency } from "./useCurrency";

export default function OrderSummary({
  subtotal,
  tax,
  deliveryFee,
  total,
  discountAmount,
  discountCode,
  onApplyDiscount,
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
  } = useCurrency(); //  currencySymbol

  // Handle checkout button click
  const handleCheckout = () => {
    if (itemCount === 0) {
      setCheckoutMessage("Your cart is empty! Add some items first.");
      setShowToast(true);
      return;
    }

    if (total < 500) {
      setCheckoutMessage("Minimum order amount is Rs.500");
      setShowToast(true);
      return;
    }

    // Show success message and modal
    setCheckoutMessage("🎉 Great choice! Your order is ready for checkout.");
    setShowCheckoutModal(true);
  };

  return (
    <>
      {" "}
      {/*  Added React Fragment */}
      <div className="bg-[#F0EADC] rounded-lg shadow-sm border-1 w-full max-w-[455px] h-full max-h-[532px] p-4 md:p-6 mx-auto space-y-6 ml-0 ">
        {/* Currency Section */}
        <div className="flex items-center mb-4">
          <Currency
            selectedCurrency={selectedCurrency}
            onCurrencyChange={handleCurrencyChange}
          />
        </div>

        {/* Title */}
        <h2 className="text-lg md:text-xl font-semibold mb-4 font-primary">
          Order Summary
        </h2>

        {/* Order Details */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm md:text-base">
            <span className="text-gray-600 font-primary">Subtotal</span>
            <span className="font-medium font-primary">
              {formatPrice(subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm md:text-base">
            <span className="text-gray-600 font-primary">Including Tax</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between text-sm md:text-base">
            <span className="text-gray-600 font-primary">Delivery Fee</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-sm md:text-base text-green-600">
              <span className="font-primary">Discount ({discountCode})</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}

          <div className="border-t border-gray-200 pt-3 mt-3">
            <div className="flex justify-between font-semibold font-primary text-sm md:text-base">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Discount Section */}
        <DiscountCodeInput
          onApplyDiscount={onApplyDiscount}
          loading={loading}
        />

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          className="w-full py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-black font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Processing..." : "Go to Checkout"}
        </button>

        {/*  Quick info message with proper currency symbol */}
        <div className="text-xs text-gray-500 text-center">
          🔒 Secure checkout • 📦 Free delivery on orders above {currencySymbol}
          2000
        </div>
      </div>
      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        cartTotal={total}
        itemCount={itemCount}
      />
      {/* Toast Notification */}
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
