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
    // Discount code logic would go here
    alert(`Applying discount code: ${discountCode}`);
    setDiscountCode("");
  };

  return (
    <div className="bg-[#F0EADC] rounded-lg shadow-sm border-1 w-[455px] h-[534px] top-[316px] left-[833px] pt-[10px] pr-[24px] pb-[10px] pl-[24px] ">
      <div className="flex items-center mb-4">
        <Currency />
      </div>
      <h2 className="text-xl font-semibold mb-4 font-primary">Order Summary</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600 font-primary">Subtotal</span>
          <span className="font-medium font-primary">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 font-primary">Including Tax</span>
          <span>{tax}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 font-primary">Delivery Fee</span>
          <span>{deliveryFee}</span>
        </div>
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between font-semibold font-primary">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleApplyDiscount} className="flex items-center mb-6">
        <div className="flex items-center border border-gray-300 rounded-l px-3 py-2 flex-grow">
          {/* ✅ Using Lucide Tag Icon */}
          <Tag className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Add discount code"
            className="outline-none w-[276px] h-[50px] pt-[12px] pr-[16px] pb-[12px] pl-[16px] gap-[12px] bg-[#F0F0F0] rounded-2xl"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 w-[119px] h-[50px] pt-[12px] pr-[16px] pb-[12px] pl-[16px] gap-[12px] rounded-2xl hover:bg-gray-800"
        >
          Apply
        </button>
      </form>

      <button className="w-[407px] h-[60px] pt-[16px] pr-[54px] pb-[16px] pl-[54px] gap-[12px] rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 transition-colors">
        Go to Checkout
      </button>
    </div>
  );
}
