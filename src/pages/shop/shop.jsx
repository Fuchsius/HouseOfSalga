import Header from "./shop-header";
import FilterSidebar from "./filter-sidebar";
import Pagination from "./pagination";
import Footer from "./shop-footer";
import ProductCard from "./product-card";
import { useState } from "react";

export default function ShopPage() {
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
    {
      id: 10,
      name: "Red Dress",
      price: 7500,
      originalPrice: null,
      image: "4.png",
      rating: 5,
      reviews: 178,
      isNew: false,
    },
    {
      id: 11,
      name: "Full Suit",
      price: 9500,
      originalPrice: null,
      image: "5.png",
      rating: 4,
      reviews: 134,
      isNew: false,
    },
    {
      id: 12,
      name: "Black Tops",
      price: 2500,
      originalPrice: null,
      image: "1.png",
      rating: 4,
      reviews: 102,
      isNew: false,
    },
    {
      id: 13,
      name: "Blue Jeans",
      price: 3000,
      originalPrice: null,
      image: "6.png",
      rating: 4,
      reviews: 120,
      isNew: false,
    },
    {
      id: 14,
      name: "White Shirt",
      price: 2000,
      originalPrice: null,
      image: "5.png",
      rating: 5,
      reviews: 95,
      isNew: true,
    },
  ];
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen  bg-[#F0EADC] text-lg md:">
      <Header />
      <div className="max-w-6xl mx-auto">
        <div className="xl:grid xl:grid-cols-5 gap-1 hidden ">
          <div className="col-span-2 ">
            <FilterSidebar />
          </div>

          <div className="xl:col-span-3 grid xl:grid-cols-3 gap-4">
            {products.slice(0, 9).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="xl:col-span-5 grid xl:grid-cols-5 gap-4">
            {products.slice(9).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        {/*mobile view*/}
        <div className="xl:hidden mb-4">
          <button
            className="bg-[#F0EADC] text-black px-4 py-2 rounded font-primary"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Sidebar Toggle */}
          {isSidebarOpen && (
            <div className="mt-4">
              <FilterSidebar />
            </div>
          )}
        </div>

        <div className="xl:hidden flex flex-wrap gap-4 justify-center">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-6">
          <Pagination />
        </div>
      </div>
      <Footer />
    </div>
  );
}
