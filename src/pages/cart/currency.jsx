import { useState } from "react";

export default function CurrencyDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("LKR");

  const currencies = ["Rs", "USD", "EUR", "GBP"];

  // Toggle dropdown only when icon is clicked
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectCurrency = (currency) => {
    setSelectedCurrency(currency);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="relative w-40">
      {/* Currency label and icon */}
      <div className="flex items-center justify-between bg-[#F0EADC]  p-2">
        <span className="text-gray-700 font-Playfair Display size-[20px] w-[400]font-primary">
          Currency{selectedCurrency}
        </span>

        {/* Only this icon will trigger the dropdown */}
        <img
          src="/drop-down.png" // Your icon image path
          className={`w-6 h-6 cursor-pointer transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          alt="Dropdown Icon"
          onClick={toggleDropdown} // Only icon has click event
        />
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute mt-2 bg-[#F0EADC] border border-[#F0EADC] rounded-lg shadow-lg w-full z-10">
          {currencies.map((currency) => (
            <div
              key={currency}
              onClick={() => selectCurrency(currency)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-primary"
            >
              {currency}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
