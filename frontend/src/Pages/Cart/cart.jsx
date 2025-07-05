import { useCart } from "./useCart";
import CartItems from "./cart-items";
import OrderSummary from "./order-summary";
import Footer from "../../Components/Footer/Footer";
import Header from "../../Components/Header/Header";

import { useCurrency } from "./useCurrency";

import "./cart.css";
import Breadcrumb from "../../Components/breadcrumb";

export default function CartPage() {
  const { cart, loading, error, updateQuantity, removeItem, applyDiscount } =
    useCart();
  const { formatPrice } = useCurrency();

  // Loading and error states
  if (loading && !cart) {
    return (
      <div className="cart-page-loading-container">
        <div className="cart-page-loading-text">Loading cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page-loading-container">
        <div className="cart-page-error-text">Error: {error}</div>
      </div>
    );
  }

  // Use backend data instead of static data
  const cartItems = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const tax = cart?.tax || 250;
  const deliveryFee = cart?.deliveryFee || 150;
  const total = cart?.total || 0;
  const discountAmount = cart?.discountAmount || 0;
  const discountCode = cart?.discountCode || "";

  // Update quantity function to use backend
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  // Remove item function to use backend
  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
  };

  // Apply discount function
  const handleApplyDiscount = async (discountCode) => {
    return await applyDiscount(discountCode);
  };

  return (
    <>
      <Header />
      <div className="cart-page-container">
        <div className="cart-page-content-wrapper">
          <Breadcrumb paths={["Home", "Cart"]} />
          <h1 className="cart-page-title">
            My Cart
            <span className="cart-page-title-underline"></span>
          </h1>

          <div className="cart-page-layout">
            <div className="cart-page-items-section">
              <CartItems
                items={cartItems}
                updateQuantity={handleUpdateQuantity}
                removeItem={handleRemoveItem}
                loading={loading} // Pass loading state
                formatPrice={formatPrice}
              />
            </div>
            <div className="cart-page-summary-section">
              <OrderSummary
                subtotal={subtotal}
                tax={tax}
                deliveryFee={deliveryFee}
                total={total}
                discountAmount={discountAmount} // Pass discount amount
                discountCode={discountCode} // Pass discount code
                onApplyDiscount={handleApplyDiscount} // Pass discount function
                loading={loading} // Pass loading state
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
