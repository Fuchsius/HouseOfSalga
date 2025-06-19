import Header from "./shop-header";
import FilterSidebar from "./filter-sidebar";
import ProductGrid from "./product-grid";
import Pagination from "./pagination";
import Footer from "./shop-footer";

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#F0EADC]">
      <Header />
      <div className="container mx-auto px-4 py-6">
        {/* Main content with sidebar and first 6 products */}
        <div className="flex gap-6">
          <FilterSidebar />
          <div className="flex-1">
            <ProductGrid />
          </div>
        </div>

        {/* Last row spanning full width from left corner */}
        <div className="mt-8">
          <ProductGrid isLastRow={true} />
        </div>

        <div className="mt-6">
          <Pagination />
        </div>
      </div>
      <Footer />
    </div>
  );
}
