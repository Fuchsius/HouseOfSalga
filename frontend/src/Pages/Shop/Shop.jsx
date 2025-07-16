import "./Shop.css";
import Footer from "../../Components/Footer/Footer";
import Header from "../../Components/Header/Header";
import ShopHeader from "./shop-header";
import ShopFooter from "./shop-footer";
import FilterSidebar from "./filter-sidebar";
import ProductCard from "../../Components/ProductCard/ProductCard";
import Pagination from "./pagination";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";

const PRODUCTS_PER_PAGE = 9;
const DEFAULT_FILTERS = {
  minPrice: 0,
  maxPrice: 50000,
  category: '',
  size: '',
  colors: [],
  sort: 'newest'
};

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function ShopPage() {
  const [productData, setProductData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const abortControllerRef = useRef(null);

  const totalPages = useMemo(() => 
    Math.ceil(totalProducts / PRODUCTS_PER_PAGE), 
    [totalProducts]
  );

  const buildQueryParams = useCallback((filterParams, page = 1) => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', PRODUCTS_PER_PAGE.toString());

    if (Array.isArray(filterParams.category) && filterParams.category.length > 0) {
      queryParams.append('category', filterParams.category.join(','));
    }
    if (Array.isArray(filterParams.size) && filterParams.size.length > 0) {
      queryParams.append('size', filterParams.size.join(','));
    }
    if (Array.isArray(filterParams.colors) && filterParams.colors.length > 0) {
      queryParams.append('color', filterParams.colors.join(','));
    }
    if (filterParams.minPrice > DEFAULT_FILTERS.minPrice) {
      queryParams.append('minPrice', filterParams.minPrice.toString());
    }
    if (filterParams.maxPrice < DEFAULT_FILTERS.maxPrice) {
      queryParams.append('maxPrice', filterParams.maxPrice.toString());
    }
    if (filterParams.sort && filterParams.sort !== DEFAULT_FILTERS.sort) {
      queryParams.append('sort', filterParams.sort);
    }

    queryParams.append('inStock', 'true');
    return queryParams;
  }, []);

  const fetchProducts = useCallback(async (filterParams, page) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = buildQueryParams(filterParams, page);
      const url = `${API_BASE_URL}/api/products?${queryParams.toString()}`;

      const controller = new AbortController();
      abortControllerRef.current = controller;
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.success) {
        setProductData(data.data || []);
        setTotalProducts(data.pagination?.totalProducts || data.count || 0);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError(error.message.includes('Failed to fetch') ? 'Network error. Check your connection.' : error.message);
        setProductData([]);
        setTotalProducts(0);
      }
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
      abortControllerRef.current = null;
    }
  }, [buildQueryParams]);

  useEffect(() => {
    fetchProducts(filters, currentPage);
  }, []);

  useEffect(() => {
    if (!isInitialLoad) fetchProducts(filters, currentPage);
  }, [filters, currentPage, fetchProducts, isInitialLoad]);

  const handleApplyFilter = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchProducts(newFilters, 1);
  }, [fetchProducts]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    fetchProducts(filters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters, fetchProducts]);

  const handleRetry = () => fetchProducts(filters, currentPage);

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
    fetchProducts(DEFAULT_FILTERS, 1);
  };

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

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

  const products = useMemo(() => {
    return productData.map((item, index) => {
      const productId = item._id || item.id || `product-${index}`;
      const productImages = item.images?.length > 0 ? item.images : item.image ? [item.image] : ['/placeholder.svg'];

      return {
        _id: productId,
        id: productId,
        name: item.name || `Product ${index + 1}`,
        price: item.price || 0,
        originalPrice: item.originalPrice,
        images: productImages,
        image: productImages[0],
        averageRating: item.rating || 0,
        rating: Math.round(item.rating || 0),
        reviewCount: item.numReviews || 0,
        isNew: item.isNew || false,
        category: Array.isArray(item.category) ? item.category : [item.category].filter(Boolean),
        size: Array.isArray(item.size) ? item.size : [item.size].filter(Boolean),
        color: Array.isArray(item.color) ? item.color : [item.color].filter(Boolean),
        description: item.description || 'Product description',
        inStock: item.inStock !== false,
        sort: Array.isArray(item.sort) ? item.sort : [item.sort].filter(Boolean),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });
  }, [productData]);

  return (
    <>
      <Header />
      <div className="page-container">
        <ShopHeader onApplyEdits={handleApplyFilter} />
        <div className="px-4 py-6 mx-auto max-w-7xl">
          {loading && (
            <div className="centered">
              <div><div className="spinner"></div><p className="loading-text">Loading products...</p></div>
            </div>
          )}

          {error && (
            <div className="error-box">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
              <div className="mt-4 space-x-2">
                <button onClick={handleRetry} className="retry-btn">Retry</button>
                <button onClick={handleResetFilters} className="retry-btn">Reset Filters</button>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="mb-6">
                <h2 className="section-heading">Products</h2>
                <p className="subtext">{totalProducts} product{totalProducts !== 1 ? 's' : ''} found (Page {currentPage} of {totalPages})</p>
              </div>

              <div className="gap-1 desktop-grid">
                <div className="col-span-2">
                  <FilterSidebar onApplyFilter={handleApplyFilter} currentFilters={filters} totalProducts={totalProducts} />
                </div>
                <div className="col-span-3">
                  <div className="product-grid-3">
                    {products.slice(0, 9).map((product, index) => (
                      <ProductCard key={`grid3-${index}`} product={product} onAddToCart={handleAddToCart} />
                    ))}
                  </div>
                </div>

                {products.length > 9 && (
                  <>
                    <div className="col-span-2"></div>
                    <div className="col-span-5">
                      <div className="product-grid-5">
                        {products.slice(9, 14).map((product, index) => (
                          <ProductCard key={`grid5-1-${index}`} product={product} onAddToCart={handleAddToCart} />
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {products.length > 14 && (
                  <div className="col-span-5">
                    <div className="product-grid-5">
                      {products.slice(14).map((product, index) => (
                        <ProductCard key={`grid5-2-${index}`} product={product} onAddToCart={handleAddToCart} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="xl:hidden">
                <div className="mb-4 flex items-center justify-between">
                  <button className="mobile-toggle-btn" onClick={toggleSidebar}>{isSidebarOpen ? 'Hide Filters' : 'Show Filters'}</button>
                  <span className="text-sm text-gray-600">{totalProducts} product{totalProducts !== 1 ? 's' : ''}</span>
                </div>
                {isSidebarOpen && (
                  <div className="sidebar-wrapper mb-6">
                    <FilterSidebar onApplyFilter={handleApplyFilter} currentFilters={filters} totalProducts={totalProducts} />
                  </div>
                )}
                <div className="mobile-grid">
                  {products.map((product, index) => (
                    <div key={`mobile-${index}`} className="flex justify-center">
                      <ProductCard product={product} onAddToCart={handleAddToCart} />
                    </div>
                  ))}
                </div>
              </div>

              {totalPages > 1 && (
                <div className="pagination-container">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
              )}
            </>
          )}
        </div>
        <ShopFooter />
      </div>
      <Footer />
    </>
  );
}
