import { useState } from "react";
import { Tag } from "lucide-react";
import Currency from "./currency";

export default function OrderSummary({ subtotal, tax, deliveryFee, total }) {
  const [discountCode, setDiscountCode] = useState("");

  const formatPrice = (price) => {
    return `Rs.${price.toLocaleString("en-IN")}.00`;
  };

  const handleApplyDiscount = (e) => {
    e.preventDefault();
    alert(`Applying discount code: ${discountCode}`);
    setDiscountCode("");
  };

  return (
    <div className="bg-[#F0EADC] rounded-lg shadow-sm border-1 w-full max-w-[455px] h-full max-h-[532px] p-4 md:p-6 mx-auto space-y-6 ml-0 ">
      {/* Currency Section */}
      <div className="flex items-center mb-4">
        <Currency />
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
          <span>{tax}</span>
        </div>
        <div className="flex justify-between text-sm md:text-base">
          <span className="text-gray-600 font-primary">Delivery Fee</span>
          <span>{deliveryFee}</span>
        </div>

        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between font-semibold font-primary text-sm md:text-base">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Discount Section */}
      <form
        onSubmit={handleApplyDiscount}
        className="flex flex-col sm:flex-row items-stretch gap-2 mb-6"
      >
        <div className="flex items-center border border-gray-300 rounded-l px-3 py-2 flex-grow bg-[#F0F0F0] rounded-2xl">
          <Tag className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Add discount code"
            className="outline-none w-full bg-transparent"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-2xl hover:bg-gray-800 w-full sm:w-auto"
        >
          Apply
        </button>
      </form>

      {/* Checkout Button */}
      <button className="w-full py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-black font-medium transition-colors">
        Go to Checkout
      </button>
    </div>
  );
}
