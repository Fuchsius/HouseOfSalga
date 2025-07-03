import Footer from "../../Components/Footer/Footer";
import Header from "../../Components/Header/Header";

import ShopHeader from "./shop-header";
import FilterSidebar from "./filter-sidebar";
import Pagination from "./pagination";
import ShopFooter from "./shop-footer";
import ProductCard from "./product-card";
import { useEffect, useState } from "react";

export default function ShopPage() {
  const [productData, setProductData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  // Fetch products function
  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();

      if (filters.minPrice && filters.minPrice !== 500) {
        queryParams.append("minPrice", filters.minPrice);
      }
      if (filters.maxPrice && filters.maxPrice !== 10000) {
        queryParams.append("maxPrice", filters.maxPrice);
      }
      if (filters.category) {
        queryParams.append("category", filters.category);
      }
      if (filters.size) {
        queryParams.append("size", filters.size);
      }
      if (filters.colors && filters.colors.length > 0) {
        queryParams.append("colors", filters.colors.join(","));
      }
      if (filters.sort) {
        queryParams.append("sort", filters.sort);
      }

      const hasFilters = queryParams.toString().length > 0;
      const url = hasFilters
        ? `http://localhost:5000/api/products?${queryParams.toString()}`
        : "http://localhost:5000/api/products/all";

      console.log("Fetching from URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setProductData(data.data);
        setTotalProducts(data.count);
        console.log("Products fetched successfully:", data.data);
      } else {
        throw new Error(data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError(error.message);
      setProductData([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle filter application from FilterSidebar
  const handleApplyFilter = (filters) => {
    console.log("Applying filters:", filters);
    fetchProducts(filters);
  };

  // Transform backend data to frontend format
  const products = productData.map((item, index) => {
    // Generate a reliable ID with multiple fallbacks
    const productId =
      item._id ||
      item.id ||
      `product-${index}` ||
      `fallback-${Date.now()}-${index}`;

    return {
      id: productId,
      name: item.name || `Product ${index + 1}`,
      price: item.price || 0,
      originalPrice: item.originalPrice,
      image: item.image || "/placeholder.svg?height=300&width=300",
      rating: Math.round(item.averageRating || 4),
      reviews: item.reviewCount || 0,
      isNew: item.isNew || false,
      category: item.category,
      size: item.size,
      color: item.color,
      description: item.description,
      inStock: item.inStock !== false,
      sort: item.sort,
    };
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F0EADC] text-lg">
        <ShopHeader onApplyEdits={handleApplyFilter} />

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
              <button
                onClick={() => fetchProducts()}
                className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Retry
              </button>
            </div>
          )}

          {/* Products Header */}
          {!loading && !error && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Products
              </h2>
              <p className="text-gray-600">{totalProducts} products found</p>
            </div>
          )}

          {/* Desktop Layout */}
          <div className="xl:grid xl:grid-cols-5 gap-1 hidden">
            {/* Filter Sidebar - Takes 2 columns */}
            <div className="col-span-2">
              <FilterSidebar onApplyFilter={handleApplyFilter} />
            </div>

            {/* First 9 products in 3 columns (right side) */}
            <div className="col-span-3">
              {!loading && !error && products.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {products.slice(0, 9).map((product, index) => (
                    <ProductCard
                      key={`first-${product.id}-${index}`}
                      product={product}
                    />
                  ))}
                </div>
              ) : (
                !loading &&
                !error && (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">
                      No products found matching your filters.
                    </p>
                    <button
                      onClick={() => fetchProducts()}
                      className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded"
                    >
                      Show All Products
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Fourth row - 5 products starting from end of filter sidebar */}
            {!loading && !error && products.length > 9 && (
              <>
                {/* Empty space for filter sidebar alignment */}
                <div className="col-span-2"></div>

                {/* 5 products spanning 3 columns (right side) */}
                <div className="col-span-5">
                  <div className="grid grid-cols-5 gap-3 mt-4">
                    {products.slice(9, 14).map((product, index) => (
                      <ProductCard
                        key={`fourth-row-${product.id}-${index + 9}`}
                        product={product}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Remaining products in 5 columns spanning full width */}
            {!loading && !error && products.length > 14 && (
              <div className="col-span-5">
                <div className="grid grid-cols-5 gap-3 mt-4">
                  {products.slice(14).map((product, index) => (
                    <ProductCard
                      key={`remaining-${product.id}-${index + 14}`}
                      product={product}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Layout */}
          <div className="xl:hidden">
            {/* Mobile Filter Toggle */}
            <div className="mb-4">
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded font-primary font-semibold w-full sm:w-auto"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? "Hide Filters" : "Show Filters"} (
                {totalProducts} products)
              </button>
            </div>

            {/* Mobile Filter Sidebar */}
            {isSidebarOpen && (
              <div className="mb-6">
                <FilterSidebar onApplyFilter={handleApplyFilter} />
              </div>
            )}

            {/* Mobile Products Grid */}
            {!loading && !error && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product, index) => (
                  <div
                    key={`mobile-${product.id}-${index}`}
                    className="flex justify-center"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              !loading &&
              !error && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    No products found matching your filters.
                  </p>
                  <button
                    onClick={() => fetchProducts()}
                    className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded"
                  >
                    Show All Products
                  </button>
                </div>
              )
            )}
          </div>

          {/* Pagination */}
          {!loading && !error && products.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>

        <ShopFooter />
      </div>
      <Footer />
    </>
  );
}
