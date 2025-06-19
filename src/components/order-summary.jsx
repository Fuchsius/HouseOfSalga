import { useState } from "react";

export default function OrderSummary({ subtotal, tax, deliveryFee, total }) {
  const [discountCode, setDiscountCode] = useState("");

  const formatPrice = (price) => {
    return `Rs.${price.toLocaleString("en-IN")}.00`;
  };

  const handleApplyDiscount = (e) => {
    e.preventDefault();
    // Discount code logic would go here
    alert(`Applying discount code: ${discountCode}`);
    setDiscountCode("");
  };

  return (
    <div className="bg-[#F0EADC] rounded-lg shadow-sm p-6 border-1">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Including Tax</span>
          <span>{tax}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery Fee</span>
          <span>{deliveryFee}</span>
        </div>
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleApplyDiscount} className="flex items-center mb-6">
        <div className="flex items-center border border-gray-300 rounded-l px-3 py-2 flex-grow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          <input
            type="text"
            placeholder="Add discount code"
            className="outline-none w-full"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-r hover:bg-gray-800"
        >
          Apply
        </button>
      </form>

      <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 rounded transition-colors">
        Proceed to Checkout
      </button>
    </div>
  );
}
