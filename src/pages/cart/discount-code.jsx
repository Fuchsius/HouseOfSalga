import { useState } from "react";
import { Tag, ChevronDown, X } from "lucide-react";

export default function DiscountCodeInput({ onApplyDiscount, loading }) {
  const [discountCode, setDiscountCode] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [discountMessage, setDiscountMessage] = useState("");
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);

  //  Available discount codes
  const availableCodes = [
    { code: "SAVE10", description: "10% off (Min: Rs.1,000)" },
    { code: "FLAT500", description: "Rs.500 off (Min: Rs.2,000)" },
    { code: "WELCOME20", description: "20% off (Min: Rs.1,500)" },
  ];

  const handleApplyDiscount = async (e) => {
    e.preventDefault();
    if (!discountCode.trim()) return;

    const result = await onApplyDiscount(discountCode);
    setDiscountMessage(result.message);

    if (result.success) {
      setDiscountCode("");
      setIsDiscountApplied(true);
      setTimeout(() => setDiscountMessage(""), 3000);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode("");
    setDiscountMessage("Discount removed.");
    setIsDiscountApplied(false); //
    setTimeout(() => setDiscountMessage(""), 3000);
  };

  const selectCode = (code) => {
    setDiscountCode(code);
    setShowDropdown(false);
  };

  return (
    <div className="space-y-2">
      <form
        onSubmit={handleApplyDiscount}
        className="flex flex-col sm:flex-row items-stretch gap-2"
      >
        <div className="relative flex-grow">
          <div className="flex items-center border border-gray-300 rounded-l px-3 py-2 bg-[#F0F0F0] rounded-2xl">
            <Tag className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Add discount code"
              className="outline-none w-full bg-transparent"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              disabled={loading || isDiscountApplied}
            />
            {/* Dropdown toggle button */}
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="ml-2 p-1 hover:bg-gray-200 rounded"
              disabled={isDiscountApplied}
            >
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Dropdown with available codes */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <div className="p-2 text-sm text-gray-600 border-b">
                Available Codes:
              </div>
              {availableCodes.map((item) => (
                <div
                  key={item.code}
                  onClick={() => selectCode(item.code)}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                >
                  <div className="font-medium text-green-600">{item.code}</div>
                  <div className="text-xs text-gray-500">
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isDiscountApplied ? (
          <button
            type="button"
            onClick={handleRemoveDiscount}
            className="bg-red-100 text-red-400 w-2.5 px-4 py-2 rounded-2xl hover:bg-red-200 w-full sm:w-auto"
          >
            <X className="inline-block w-3 h-3 mr-1" />
            Remove
          </button>
        ) : (
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-2xl hover:bg-gray-800 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !discountCode.trim()}
          >
            {loading ? "Applying..." : "Apply"}
          </button>
        )}
      </form>

      {/* Show available codes as chips */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-gray-500">Quick codes:</span>
        {availableCodes.map((item) => (
          <button
            key={item.code}
            onClick={() => selectCode(item.code)}
            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full hover:bg-green-200"
            disabled={isDiscountApplied}
          >
            {item.code}
          </button>
        ))}
      </div>

      {/* Discount message */}
      {discountMessage && (
        <div
          className={`text-sm ${
            discountMessage.includes("successfully")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {discountMessage}
        </div>
      )}
    </div>
  );
}
