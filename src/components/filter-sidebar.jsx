import { useState } from "react";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Slider } from "../components/ui/slider";
import { AlignJustify } from "lucide-react";

export default function FilterSidebar() {
  const [priceRange, setPriceRange] = useState([5000, 8000]);

  const colors = [
    { name: "Green", class: "bg-green-500" },
    { name: "Red", class: "bg-red-500" },
    { name: "Orange", class: "bg-orange-500" },
    { name: "Yellow", class: "bg-yellow-400" },
    { name: "Blue", class: "bg-blue-500" },
    { name: "Purple", class: "bg-purple-500" },
    { name: "Pink", class: "bg-pink-500" },
    { name: "Black", class: "bg-black" },
  ];

  return (
    <div className="w-[428px] h-[1044px] top-[259px] left-[160px] bg-[#F0EADC] p-6 rounded-lg shadow-sm">
      {/* Filters Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-gray-900">FILTERS</h2>
        <AlignJustify className="w-4 h-4 mr-2" />
        <span className="text-sm text-gray-500">(3)</span>
      </div>

      {/* Focus Section */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">FOCUS</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="women" defaultChecked />
            <label htmlFor="women" className="text-sm text-gray-700">
              Women
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="ladies" />
            <label htmlFor="ladies" className="text-sm text-gray-700">
              Ladies
            </label>
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-900">
            ₹5000 - ₹8000
          </span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={10000}
          min={1000}
          step={500}
          className="w-full"
        />
      </div>

      {/* Size Section */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">SIZE</h3>
        <div className="space-y-2">
          {["Small", "Medium", "Large", "Extra Large"].map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox id={size.toLowerCase()} />
              <label
                htmlFor={size.toLowerCase()}
                className="text-sm text-gray-700"
              >
                {size}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Colors Section */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Colors</h3>
        <div className="grid grid-cols-4 gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              className={`w-8 h-8 rounded-full ${color.class} border-2 border-gray-200 hover:border-gray-400 transition-colors`}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Apply Filter Button */}
      <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium">
        Apply filter
      </Button>
    </div>
  );
}
