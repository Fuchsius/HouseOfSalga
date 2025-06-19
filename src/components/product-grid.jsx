import ProductCard from "./product-card";

const products = [
  {
    id: 1,
    name: "Black Tops",
    price: 2500,
    originalPrice: null,
    image: "1.png",
    rating: 4,
    reviews: 102,
    isNew: false,
  },
  {
    id: 2,
    name: "Women Jacket",
    price: 5500,
    originalPrice: null,
    image: "2.png",
    rating: 5,
    reviews: 89,
    isNew: true,
  },
  {
    id: 3,
    name: "Denim Jacket",
    price: 8000,
    originalPrice: null,
    image: "3.png",
    rating: 4,
    reviews: 156,
    isNew: false,
  },
  {
    id: 4,
    name: "Denim Jacket",
    price: 8000,
    originalPrice: null,
    image: "3.png",
    rating: 4,
    reviews: 203,
    isNew: false,
  },
  {
    id: 5,
    name: "Red Dress",
    price: 7500,
    originalPrice: null,
    image: "4.png",
    rating: 5,
    reviews: 178,
    isNew: false,
  },
  {
    id: 6,
    name: "Full Suit",
    price: 9500,
    originalPrice: null,
    image: "5.png",
    rating: 4,
    reviews: 134,
    isNew: false,
  },
  {
    id: 7,
    name: "Black Tops",
    price: 2500,
    originalPrice: null,
    image: "1.png",
    rating: 4,
    reviews: 102,
    isNew: false,
  },
  {
    id: 8,
    name: "Women Jacket",
    price: 5500,
    originalPrice: null,
    image: "2.png",
    rating: 5,
    reviews: 89,
    isNew: false,
  },
  {
    id: 9,
    name: "Denim Jacket",
    price: 8000,
    originalPrice: null,
    image: "3.png",
    rating: 4,
    reviews: 156,
    isNew: false,
  },
];

export default function ProductGrid({ isLastRow = false }) {
  if (isLastRow) {
    // Last row products spanning full width from left corner
    const lastRowProducts = products.slice(3, 8);

    return (
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl gap-3">
          {lastRowProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  }

  // First 6 products in right column (3 rows x 2 columns)
  const rightColumnProducts = products.slice(0, 9);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rightColumnProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
