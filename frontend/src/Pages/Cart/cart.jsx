import { useCart } from "./useCart";
import Breadcrumb from "../../Components/breadcrumb";
import CartItems from "./cart-items";
import OrderSummary from "./order-summary";
import Footer from "../../Components/Footer/Footer";
import Header from "../../Components/Header/Header";

import { useCurrency } from "./useCurrency";

export default function CartPage() {
  //  Static Cart items with backend data
  const { cart, loading, error, updateQuantity, removeItem, applyDiscount } =
    useCart();
  const { formatPrice } = useCurrency();
  //  Loading and error states
  if (loading && !cart) {
    return (
      <div className="min-h-screen bg-[#F0EADC] py-8 flex items-center justify-center">
        <div className="text-lg font-primary">Loading cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F0EADC] py-8 flex items-center justify-center">
        <div className="text-lg font-primary text-red-600">Error: {error}</div>
      </div>
    );
  }

  //  Use backend data instead of static data
  const cartItems = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const tax = cart?.tax || 250;
  const deliveryFee = cart?.deliveryFee || 150;
  const total = cart?.total || 0;
  const discountAmount = cart?.discountAmount || 0;
  const discountCode = cart?.discountCode || "";

  //  Update quantity function to use backend
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  //  Remove item function to use backend
  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
  };

  //  Apply discount function
  const handleApplyDiscount = async (discountCode) => {
    return await applyDiscount(discountCode);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen  py-8 ">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 ">
          <Breadcrumb />
          <h1 className="text-3xl font-bold mt-6 mb-8 relative inline-block font-primary text-[#3C4242] ml-4 lg:ml-20">
            My Cart
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-yellow-400"></span>
          </h1>

          <div className="flex flex-col lg:flex-row gap-8  ">
            <div className="w-full lg:w-2/3  ">
              <CartItems
                items={cartItems}
                updateQuantity={handleUpdateQuantity}
                removeItem={handleRemoveItem}
                loading={loading} //  Pass loading state
                formatPrice={formatPrice}
              />
            </div>
            <div className="w-full lg:w-1/3 lg:ml-8 mr-72">
              <OrderSummary
                subtotal={subtotal}
                tax={tax}
                deliveryFee={deliveryFee}
                total={total}
                discountAmount={discountAmount} // Pass discount amount
                discountCode={discountCode} // Pass discount code
                onApplyDiscount={handleApplyDiscount} //  Pass discount function
                loading={loading} //  Pass loading state
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
