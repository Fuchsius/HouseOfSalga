import { useState } from "react";
import Breadcrumb from "./breadcrumb";
import CartItems from "./cart-items";
import OrderSummary from "./order-summary";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Classic Top",
      size: "Size: M",
      price: 2500.0,
      quantity: 1,
      image: "6.png",
      color: "blue",
    },
    {
      id: 2,
      name: "Full Fit",
      size: "Color: 01",
      price: 6900.0,
      quantity: 1,
      image: "5.png",
      color: "red",
    },
    {
      id: 3,
      name: "Winter Jersey",
      size: "Size: L",
      price: 5100.0,
      quantity: 1,
      image: "2.png",
      color: "green",
    },
  ]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = 250;
  const deliveryFee = 150;
  const total = subtotal + tax + deliveryFee;

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F0EADC] py-8 ">
      <div className="container mx-auto px-4  ">
        <Breadcrumb />
        <h1 className="text-3xl font-bold mt-6 mb-8 relative inline-block font-primary text-[#3C4242] ml-40">
          My Cart
          <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-yellow-400"></span>
        </h1>

        <div className="flex flex-col lg:flex-row ">
          <div className="lg:w-2/3">
            <CartItems
              items={cartItems}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          </div>
          <div className="lg:w-1/3 mr-64 ">
            <OrderSummary
              subtotal={subtotal}
              tax={tax}
              deliveryFee={deliveryFee}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
