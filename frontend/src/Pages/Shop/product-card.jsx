import { Heart, Star } from "lucide-react";
import { useState } from "react";

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg?height=300&width=300";

    if (imagePath.startsWith("http")) return imagePath;

    if (imagePath.startsWith("/")) return imagePath;

    return `/${imagePath}`;
  };

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
      return "Price unavailable";
    }
    return `Rs.${price.toLocaleString("en-IN")}.00`;
  };

  const getDisplayValue = (value) => {
    if (Array.isArray(value)) {
      return value[0] || "";
    }
    return value || "";
  };

  const getColorInfo = (color) => {
    const colorValue = getDisplayValue(color);
    if (
      !colorValue ||
      typeof colorValue !== "string" ||
      colorValue.trim() === ""
    ) {
      return null;
    }

    try {
      const colorLower = colorValue.toLowerCase().trim();
      return {
        name: colorValue,
        value: colorLower,
        isValidColor: true,
      };
    } catch (error) {
      console.warn("Error processing color:", error);
      return null;
    }
  };

  const safeProduct = {
    name: product?.name || "Unnamed Product",
    price: product?.price || 0,
    originalPrice: product?.originalPrice,
    category: getDisplayValue(product?.category),
    size: getDisplayValue(product?.size),
    color: product?.color,
    description: product?.description,
    rating:
      typeof product?.rating === "number"
        ? Math.max(0, Math.min(5, product.rating))
        : 0,
    reviews: product?.reviews || 0,
    inStock: product?.inStock !== false,
    isNew: product?.isNew || false,
    image: product?.image,
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    console.log(
      `${isWishlisted ? "Removed from" : "Added to"} favorites:`,
      safeProduct.name
    );
  };

  // ENHANCED: Better error handling
  const handleImageError = (e) => {
    console.log(" IMAGE ERROR:");
    console.log("- Failed URL:", e.target.src);
    console.log("- Product:", safeProduct.name);
    console.log("- Original path:", safeProduct.image);
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageLoad = (e) => {
    console.log(" IMAGE SUCCESS:");
    console.log("- Loaded URL:", e.target.src);
    console.log("- Product:", safeProduct.name);
    console.log(
      "- Dimensions:",
      e.target.naturalWidth,
      "x",
      e.target.naturalHeight
    );
    setImageLoaded(true);
    setImageError(false);
  };

  const colorInfo = getColorInfo(safeProduct.color);
  const imageUrl = getImageUrl(safeProduct.image);

  return (
    <div className="bg-[#e0dcf0] rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow max-w-[200px] max-h-[500px]  border-4 border-[#4D1727] auto-fit ">
      <div className="relative aspect-[3/4] overflow-hidden ">
        {/*  LOADING STATE */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-[#F0EADC] animate-pulse flex items-center justify-center z-10">
            <div className="text-gray-500 text-xs">Loading...</div>
          </div>
        )}

        {/*  ERROR STATE */}
        {imageError && (
          <div className="absolute inset-0 bg-red-100 flex items-center justify-center z-10">
            <div className="text-red-600 text-xs text-center p-2">
              <div className="text-2xl mb-1">❌</div>
              <div>Image Failed</div>
            </div>
          </div>
        )}

        {/*  MAIN IMAGE - Multiple fallbacks */}
        <div className="relative aspect-[3/4] overflow-hidden flex items-center justify-center ">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={safeProduct.name}
            className="w-full h-full  object-cover transition-transform duration-300 group-hover:scale-105 bg-[#F0EADC] p-5"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </div>

        {imageError && (
          <img
            src="/placeholder.svg?height=300&width=300"
            alt="Placeholder"
            className="w-full h-full object-cover bg-[#F0EADC]"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 5,
            }}
          />
        )}

        {/* Heart Icon */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors z-20"
          aria-label={
            isWishlisted ? "Remove from favorites" : "Add to favorites"
          }
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        {/* Badges */}
        <div className="absolute top-10 left-3 flex flex-col gap-1 z-20">
          {safeProduct.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold">
              NEW
            </span>
          )}
          {!safeProduct.inStock && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold">
              OUT OF STOCK
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="bg-[#F0EADC] pb-0.5 w-full h-full min-w-[124px] min-h-[89.81px] top-[218px] left-[38px]  items-center justify-center pl-0.5 ">
        {/* Product Name */}
        <div className="bg-[#F0EADC] flex items-center justify-center w-full  min-w-[72px] min-h-[27.43px] top-[218px] left-[64px] pl-3.5">
          <h3 className="font-primary text-gray-900 text-sm font-medium line-clamp-2 min-h-[2.5rem] flex items-center justify-center">
            {safeProduct.name}
          </h3>
        </div>

        {/* Product Details */}
        <div className="text-center space-y-1">
          {/* Category and Size */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
            {safeProduct.category && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {safeProduct.category}
              </span>
            )}
            {safeProduct.size && (
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                {safeProduct.size}
              </span>
            )}
          </div>

          {/* Color */}
          {colorInfo && (
            <div className="flex items-center justify-center gap-1">
              <span className="text-xs text-gray-600">Color:</span>
              <div
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: colorInfo.value }}
                title={colorInfo.name}
              />
              <span className="text-xs text-gray-600">{colorInfo.name}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-lg font-semibold text-gray-900 font-primary">
              {formatPrice(safeProduct.price)}
            </span>
            {safeProduct.originalPrice &&
              safeProduct.originalPrice > safeProduct.price && (
                <span className="text-sm text-gray-500 line-through font-primary">
                  {formatPrice(safeProduct.originalPrice)}
                </span>
              )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-4 ${
                  i < safeProduct.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({safeProduct.reviews})
          </span>
        </div>

        {/* Description */}
        {safeProduct.description && (
          <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-xs text-black line-clamp-2">
              {safeProduct.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
