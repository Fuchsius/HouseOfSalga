import "./Shop.css";
import Footer from "../../Components/Footer/Footer";
import Header from "../../Components/Header/Header";
import ShopHeader from "./shop-header";
import ShopFooter from "./shop-footer";
import FilterSidebar from "./filter-sidebar";
import ProductCard from "./product-card";
import Pagination from "./pagination";
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
        : "http://localhost:5000/api/products";

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

      <div className="page-container">
        <ShopHeader onApplyEdits={handleApplyFilter} />

        <div className="px-4 py-6 mx-auto max-w-7xl">
          {loading && (
            <div className="centered">
              <div>
                <div className="spinner"></div>
                <p className="loading-text">Loading products...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="error-box">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
              <button onClick={() => fetchProducts()} className="retry-btn">
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="mb-6">
              <h2 className="section-heading">Products</h2>
              <p className="subtext">{totalProducts} products found</p>
            </div>
          )}

          {/* Desktop Layout */}
          <div className="gap-1 desktop-grid">
            <div className="col-span-2">
              <FilterSidebar onApplyFilter={handleApplyFilter} />
            </div>

            <div className="col-span-3">
              {!loading && !error && products.length > 0 ? (
                <div className="product-grid-3">
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
                  <div className="py-12 text-center">
                    <p className="subtext">
                      No products found matching your filters.
                    </p>
                    <button
                      onClick={() => fetchProducts()}
                      className="mt-4 mobile-toggle-btn"
                    >
                      Show All Products
                    </button>
                  </div>
                )
              )}
            </div>


            {!loading && !error && products.length > 9 && (
              <>
                <div className="col-span-2"></div>
                <div className="col-span-5">
                  <div className="product-grid-5">
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

            {!loading && !error && products.length > 14 && (
              <div className="col-span-5">
                <div className="product-grid-5">
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

          <div className="xl:hidden">
            <div className="mb-4">
              <button
                className="mobile-toggle-btn"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? "Hide Filters" : "Show Filters"} (
                {totalProducts} products)
              </button>
            </div>

            {isSidebarOpen && (
              <div className="sidebar-wrapper">
                <FilterSidebar onApplyFilter={handleApplyFilter} />
              </div>
            )}

            {!loading && !error && products.length > 0 ? (
              <div className="mobile-grid">
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
                <div className="py-12 text-center">
                  <p className="subtext">
                    No products found matching your filters.
                  </p>
                  <button
                    onClick={() => fetchProducts()}
                    className="mt-4 mobile-toggle-btn"
                  >
                    Show All Products
                  </button>
                </div>
              )
            )}
          </div>

          {!loading && !error && products.length > 0 && (
            <div className="pagination-container">
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
