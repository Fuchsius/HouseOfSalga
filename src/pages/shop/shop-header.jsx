import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Breadcrumb from "../../components/breadcrumb";

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
    <div className="bg-[#F0EADC] border-b border-[#F0EADC] max-w-6xl mx-auto">
      <div className="py-4 px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Breadcrumb - Hidden on mobile */}
          <div className="hidden md:block flex-shrink-0">
            <Breadcrumb />
          </div>

          {/* Title and Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 md:flex-1 md:justify-end">
            <h1 className="text-lg font-primary text-gray-900 text-center md:text-left">
              Women's Red Perfection
            </h1>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-primary">
                Sort by:
              </span>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between w-32 h-8 px-3 text-sm border border-[#F0EADC] rounded-md bg-[#F0EADC] hover:bg-gray-50"
                >
                  <span className="truncate">{selectedSort}</span>
                  <ChevronDown className="w-4 h-4 flex-shrink-0 ml-1" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 z-50 w-full mt-1 bg-[#F0EADC] border-[#F0EADC] rounded-md shadow-lg">
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedSort(option);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 font-primary"
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
