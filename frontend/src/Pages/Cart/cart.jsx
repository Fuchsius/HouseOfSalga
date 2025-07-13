import { useCart } from "../Cart/useCart";
import CartItems from "./cart-items";
import OrderSummary from "../Cart/order-summary";
import Footer from "../../Components/Footer/Footer";
import Header from "../../Components/Header/Header";
import { useCurrency } from "../Cart/useCurrency";
import "./cart.css";
import Breadcrumb from "../../Components/breadcrumb";

export default function CartPage() {
  const { cart, loading, error, updateQuantity, removeItem, applyDiscount } =
    useCart();
  const { formatPrice } = useCurrency();

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

  const cartItems = cart?.items || [];

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
  };

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
                loading={loading}
                formatPrice={formatPrice}
              />
            </div>
            <div className="cart-page-summary-section">
              <OrderSummary
                subtotal={cart?.subtotal || 0}
                tax={cart?.tax || 250}
                deliveryFee={cart?.deliveryFee || 150}
                total={cart?.total || 0}
                discountAmount={cart?.discountAmount || 0}
                discountCode={cart?.discountCode || ""}
                onApplyDiscount={handleApplyDiscount}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
