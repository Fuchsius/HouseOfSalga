import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Slider } from "../../components/ui/slider";
import { SlidersHorizontal, ChevronUp } from "lucide-react";

export default function FilterSidebar({ onApplyFilter }) {
  const [priceRange, setPriceRange] = useState([500, 10000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  const colorOptions = [
    { name: "Green", class: "bg-green-500" },
    { name: "Red", class: "bg-red-500" },
    { name: "Orange", class: "bg-orange-500" },
    { name: "Yellow", class: "bg-yellow-400" },
    { name: "Blue", class: "bg-blue-500" },
    { name: "Purple", class: "bg-purple-500" },
    { name: "Pink", class: "bg-pink-500" },
    { name: "Black", class: "bg-black" },
    { name: "White", class: "bg-white border-2 border-gray-300" },
    { name: "Cyan", class: "bg-cyan-500" },
  ];

  const handleApply = () => {
    const appliedFilters = {
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      category: selectedCategories,
      size: selectedSizes,
      colors: selectedColors,
    };
    console.log("Applied filters:", appliedFilters);
    onApplyFilter(appliedFilters);
  };

  const handleClear = () => {
    setPriceRange([500, 10000]);
    setSelectedCategories("");
    setSelectedSizes("");
    setSelectedColors([]);
    onApplyFilter({
      minPrice: 500,
      maxPrice: 10000,
      category: "",
      size: "",
      colors: [],
    });
  };

  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  return (
    <div className="w-full  lg:max-w-[428px] h-auto lg:h-[1300px] top-[259px]  bg-[#F0EADC] p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-gray-900 font-primary">FILTERS</h2>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          <button
            onClick={handleClear}
            className="text-xs text-gray-600 hover:text-gray-800 underline"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-primary text-gray-900 mb-3">PRICES</h3>
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-primary">Range</h1>
          <span className="text-sm font-primary text-gray-900">
            Rs.{priceRange[0]} - Rs.{priceRange[1]}
          </span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={10000}
          min={500}
          step={500}
          className="w-full"
        />
      </div>

      {/* Category */}
      <div className="mb-6">
        <h3 className="font-primary text-gray-900 mb-3">CATEGORIES</h3>
        <div className="space-y-2">
          {["Women", "Ladies", "Men", "Kids"].map((cat) => (
            <div key={cat} className="flex items-center space-x-2">
              <Checkbox
                id={cat.toLowerCase().replace(" ", "-")}
                checked={selectedCategories.includes(cat)}
                onCheckedChange={(checked) => {
                  // Use onCheckedChange instead of onChange
                  if (checked) {
                    setSelectedCategories((prev) => [...prev, cat]);
                  } else {
                    setSelectedCategories((prev) =>
                      prev.filter((s) => s !== cat)
                    );
                  }
                }}
              />
              <label
                htmlFor={cat.toLowerCase()}
                className="text-sm text-gray-700 font-primary cursor-pointer"
              >
                {cat}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3 font-primary">SIZE</h3>
        <div className="space-y-2 font-primary">
          {["Small", "Medium", "Large", "Extra Large"].map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={size.toLowerCase().replace(" ", "-")}
                checked={selectedSizes.includes(size)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedSizes((prev) => [...prev, size]);
                  } else {
                    setSelectedSizes((prev) => prev.filter((s) => s !== size));
                  }
                }}
              />
              <label
                htmlFor={size.toLowerCase().replace(" ", "-")}
                className="text-sm text-gray-700 cursor-pointer"
              >
                {size}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900 font-primary">Colors</h3>
          <ChevronUp className="w-4 h-4" />
        </div>
        <div className="grid grid-cols-5 gap-3">
          {colorOptions.map((color) => (
            <button
              key={color.name}
              className={`w-8 h-8 rounded-full ${color.class} border-2 ${
                selectedColors.includes(color.name)
                  ? "border-black border-4"
                  : "border-gray-300"
              } hover:border-gray-400 transition-all duration-200 hover:scale-110 relative`}
              title={color.name}
              onClick={() => toggleColor(color.name)}
            >
              {selectedColors.includes(color.name) && (
                <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
        {selectedColors.length > 0 && (
          <div className="mt-2 text-xs text-gray-600">
            Selected: {selectedColors.join(", ")}
          </div>
        )}
      </div>

      {/* Apply Filter Button */}
      <Button
        onClick={handleApply}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-primary font-semibold py-3"
      >
        Apply Filter
      </Button>

      {/* Filter Summary */}
      {(selectedCategories ||
        selectedSizes ||
        selectedColors.length > 0 ||
        priceRange[0] !== 500 ||
        priceRange[1] !== 10000) && (
        <div className="mt-4 p-3 bg-white rounded-lg text-xs">
          <h4 className="font-semibold mb-2">Active Filters:</h4>
          <div className="space-y-1 text-gray-600">
            {(priceRange[0] !== 500 || priceRange[1] !== 10000) && (
              <div>
                Price: Rs.{priceRange[0]} - Rs.{priceRange[1]}
              </div>
            )}
            {selectedCategories && <div>Category: {selectedCategories}</div>}
            {selectedSizes && <div>Size: {selectedSizes}</div>}
            {selectedColors.length > 0 && (
              <div>Colors: {selectedColors.join(", ")}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
