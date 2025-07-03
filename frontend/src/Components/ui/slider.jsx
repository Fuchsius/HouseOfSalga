import { useState } from "react";

export function Slider({
  value = [0, 100],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className = "",
}) {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);

  const handleMinChange = (e) => {
    const val = Math.min(Number(e.target.value), maxVal - 1);
    setMinVal(val);
    if (onValueChange) onValueChange([val, maxVal]);
  };

  const handleMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), minVal + 1);
    setMaxVal(val);
    if (onValueChange) onValueChange([minVal, val]);
  };

  return (
    <div className={`relative w-full flex flex-col ${className}`}>
      <div className="relative w-full h-2 bg-gray-300 rounded">
        {/* Selected range highlight */}
        <div
          className="absolute h-2 bg-red-900 rounded"
          style={{
            left: `${((minVal - min) / (max - min)) * 100}%`,
            width: `${((maxVal - minVal) / (max - min)) * 100}%`,
          }}
        ></div>

        {/* Min range input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleMinChange}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none slider-thumb"
          style={{ zIndex: minVal > max - 10 ? "5" : "3" }}
        />

        {/* Max range input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={handleMaxChange}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none slider-thumb"
          style={{ zIndex: "4" }}
        />
      </div>

      {/* Price Range Display */}
      <div className="flex justify-between mt-4 text-sm text-gray-700 font-primary">
        <span>Min: {minVal}</span>
        <span>Max: {maxVal}</span>
      </div>

      {/* Slider Thumb Style */}
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #374151;
          cursor: pointer;
          pointer-events: auto;
        }
        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #374151;
          cursor: pointer;
          border: none;
          pointer-events: auto;
        }
      `}</style>
    </div>
  );
}
