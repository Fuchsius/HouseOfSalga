import "./Shop.css";
import Footer from "../../Components/Footer/Footer";
import Header from "../../Components/Header/Header";
import ShopHeader from "./shop-header";
import ShopFooter from "./shop-footer";
import FilterSidebar from "./filter-sidebar";
import ProductCard from "../../Components/ProductCard/ProductCard";
import Pagination from "./pagination";
import { useEffect, useState } from "react";

const handleAddToCart = (product) => {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find(item => item._id === product._id || item.id === product.id);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${product.name} added to cart!`);
};

export default function ShopPage() {
  const [productData, setProductData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();

      if (filters.minPrice && filters.minPrice !== 500) {
        queryParams.append("minPrice", filters.minPrice);
      }
      if (filters.maxPrice && filters.maxPrice !== 10000) {
        queryParams.append("maxPrice", filters.maxPrice);
      }
      if (filters.category?.length > 0) {
        queryParams.append("category", filters.category.join(","));
      }
      if (filters.size?.length > 0) {
        queryParams.append("size", filters.size.join(","));
      }
      if (filters.colors?.length > 0) {
        queryParams.append("color", filters.colors.join(","));
      }
      if (filters.sort) {
        queryParams.append("sort", filters.sort);
      }

      const url = queryParams.toString()
        ? `http://localhost:5000/api/products?${queryParams.toString()}`
        : "http://localhost:5000/api/products";

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.success) {
        setProductData(data.data);
        setTotalProducts(data.count);
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleApplyFilter = (filters) => {
    fetchProducts(filters);
  };

  const products = productData.map((item) => ({
    _id: item._id || item.id || `product-${Date.now()}`,
    id: item._id || item.id || `product-${Date.now()}`,
    name: item.name || "Unnamed Product",
    price: item.price || 0,
    originalPrice: item.originalPrice,
    image: item.images?.[0] || "/placeholder.svg",
    images: item.images || ["/placeholder.svg"],
    rating: Math.min(5, Math.max(0, item.rating || item.averageRating || 0)),
    reviews: item.reviews || item.reviewCount || 0,
    isNew: item.isNew || false,
    category: item.category,
    size: item.size,
    color: item.color,
    description: item.description,
    inStock: item.inStock !== false
  }));

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

          <div className="gap-1 desktop-grid">
            <div className="col-span-2">
              <FilterSidebar onApplyFilter={handleApplyFilter} />
            </div>

            <div className="col-span-3">
              {!loading && !error && products.length > 0 ? (
                <div className="product-grid-3">
                  {products.slice(0, 9).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
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
                    {products.slice(9, 14).map((product) => (
                      <ProductCard
                        key={`${product.id}-${Math.random()}`}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </div>
              </>
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
                {products.map((product) => (
                  <div key={`mobile-${product.id}`} className="flex justify-center">
                    <ProductCard product={product} onAddToCart={handleAddToCart} />
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
