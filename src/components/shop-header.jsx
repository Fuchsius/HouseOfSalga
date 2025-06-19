import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Header() {
  const [selectedSort, setSelectedSort] = useState("Most Popular");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortOptions = [
    "Most Popular",
    "Price: Low to High",
    "Price: High to Low",
    "Newest",
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600">
            <span>Home</span>
            <span className="mx-2">{">"}</span>
            <span className="text-gray-900 font-medium">Shop</span>
          </nav>

          {/* Title and Sort */}
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-medium text-gray-900">
              Women's Red Perfection
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between w-32 h-8 px-3 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                >
                  <span>{selectedSort}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedSort(option);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
