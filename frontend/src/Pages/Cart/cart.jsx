import { useCart } from "./useCart";
import CartItems from "./cart-items";
import OrderSummary from "./order-summary";
import Footer from "../../Components/Footer/Footer";
import Header from "../../Components/Header/Header";

import { useCurrency } from "./useCurrency";

import "./cart.css";
import Breadcrumb from "../../Components/breadcrumb";

export default function CartPage() {

  const { cart, loading, error, updateQuantity, removeItem, applyDiscount } = useCart();
  const { formatPrice } = useCurrency();

  // Try to use backend cart, fallback to localStorage cart
  let cartItems = cart?.items || [];
  let subtotal = cart?.subtotal || 0;
  let tax = cart?.tax || 250;
  let deliveryFee = cart?.deliveryFee || 150;
  let total = cart?.total || 0;
  // Discount removed

  // If backend cart is empty, use localStorage cart
  if ((!cartItems || cartItems.length === 0) && typeof window !== 'undefined') {
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    cartItems = localCart;
    subtotal = localCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    total = subtotal + tax + deliveryFee;
  }

  // Update quantity for localStorage cart
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    if (cartItems && cartItems.find(i => i._id === itemId)) {
      // Update localStorage cart
      const updated = cartItems.map(item =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(updated));
      window.location.reload();
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  // Remove item for localStorage cart
  const handleRemoveItem = (itemId) => {
    if (cartItems && cartItems.find(i => i._id === itemId)) {
      const updated = cartItems.filter(item => item._id !== itemId);
      localStorage.setItem('cart', JSON.stringify(updated));
      window.location.reload();
    } else {
      removeItem(itemId);
    }
  };

  // Discount removed

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
