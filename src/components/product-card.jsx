import { Heart, Star } from "lucide-react";

export default function ProductCard({ product }) {
  const formatPrice = (price) => {
    return `Rs.${price.toLocaleString("en-IN")}.00`;
  };

  return (
    <div className="bg-[#F0EADC] rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow w-[200px] h-[328px] border-1 ">
      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

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
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 ">{product.name}</h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-semibold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
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
