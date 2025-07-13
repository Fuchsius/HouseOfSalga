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
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 14;

  // Fetch products function
  const fetchProducts = async (filters = {}, page = 1) => {
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
      queryParams.append("page", page);
      queryParams.append("limit", productsPerPage);

      const hasFilters = queryParams.toString().length > 0;
      const url = hasFilters
        ? `http://localhost:5000/api/shopProducts?${queryParams.toString()}`
        : "http://localhost:5000/api/shopProducts/all";

      console.log("Fetching from URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setProductData(data.data);
        setTotalProducts(data.count);
        setTotalPages(data.pages);
        console.log("Products fetched successfully:", data.data);
      } else {
        throw new Error(data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError(error.message);
      setProductData([]);
      setTotalProducts(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts({ sort: "price-desc" }, currentPage);
  }, [currentPage]);

  const handleApplyFilter = (filters) => {
    console.log("Applying filters:", filters);
    setCurrentPage(1);
    fetchProducts(filters, 1);
  };

  const products = productData.map((item, index) => ({
    id: item.id || item._id || `product-${index}`,
    name: item.name || `Product ${index + 1}`,
    price: item.price || 0,
    image: item.image || "/placeholder.svg?height=300&width=300",
    rating: item.rating || 0,
    reviews: item.numReviews || 0,
    category: item.category || [],
    size: item.size || [],
    color: item.color || [],
    description: item.description || "Product description",
    inStock: item.inStock !== false,
    popularity: item.popularity || 0,
    createdAt: item.createdAt || new Date(),
  }));

  return (
    <>
      <Header />

      <div className="page-container">
        <ShopHeader
          onApplyEdits={handleApplyFilter}
          totalProducts={totalProducts}
        />

        <div className="content-container">
          {loading && (
            <div className="centered">
              <div>
                <div className="text-center">
                  <div className="spinner"></div>
                  <p className="loading-text">Loading products...</p>
                </div>
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
            <div className="products-header">
              <h2 className="section-heading">Products</h2>
              <p className="subtext">{totalProducts} products found</p>
            </div>
          )}

          {/* Desktop Layout */}
          <div className=" desktop-grid">
            <div className="sidebar-column">
              <FilterSidebar onApplyFilter={handleApplyFilter} />
            </div>

            <div className="products-column">
              {!loading && !error && products.length > 0 ? (
                <div className="product-grid">
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
                  <div className="no-products">
                    <p className="subtext">
                      No products found matching your filters.
                    </p>
                    <button
                      onClick={() => fetchProducts()}
                      className="reset-btn"
                    >
                      Show All Products
                    </button>
                  </div>
                )
              )}
            </div>

            {!loading && !error && products.length > 9 && (
              <>
                <div className="sidebar-spacer"></div>
                <div className="products-full-width">
                  <div className="product-grid-full">
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
              <div className="products-full-width">
                <div className="product-grid-full">
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

          <div className="mobile-only">
            <div className="filter-toggle-container">
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
              <div className="mobile-product-grid">
                {products.map((product, index) => (
                  <div
                    key={`mobile-${product.id}-${index}`}
                    className="product-card-container"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              !loading &&
              !error && (
                <div className="no-products">
                  <p className="subtext">
                    No products found matching your filters.
                  </p>
                  <button onClick={() => fetchProducts()} className="reset-btn">
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
                onPageChange={(page) => {
                  setCurrentPage(page);
                  fetchProducts({ sort: productData.sort }, page);
                }}
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
