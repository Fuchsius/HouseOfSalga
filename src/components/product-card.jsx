import { Heart, Star } from "lucide-react";

export default function ProductCard({ product }) {
  const formatPrice = (price) => {
    return `Rs.${price.toLocaleString("en-IN")}.00`;
  };

  return (
    <div className="bg-[#F0EADC] rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow max-w-[200px] max-h-[358px]  border-1 border-[#4D1727] ">
      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <div>
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="object-contain group-hover:scale-105 transition-transform duration-300 w-full h-full min-w-[159px] min-h-[186px] min-top-[19px] min-left-[21px]  top-full left-full pt-3"
          />
        </div>

        {/* Heart Icon */}
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>

        {/* New Badge */}
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded">
            NEW
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="pb-0.5 w-full h-full min-w-[124px] min-h-[89.81px] top-[218px] left-[38px]  items-center justify-center pl-0.5 ">
        <div className="flex items-center justify-center w-full  min-w-[72px] min-h-[27.43px] top-[218px] left-[64px] pl-3.5">
          <h3 className="font-primary text-gray-900  text-center ">
            {product.name}
          </h3>
        </div>

        {/* Price */}
        <div className="flex items-center justify-center  w-full  min-w-[93px] min-h-[27.33px] top-[251.19px] left-[54px] pl-5">
          <span className="text-lg font-semibold text-gray-900 font-primary">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through font-primary">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center w-full  min-w-[124px] min-h-[19.52px] top-[288.29px] left-[38px] pl-5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < product.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">
            ({product.reviews})
          </span>
        </div>
      </div>
    </div>
  );
}
