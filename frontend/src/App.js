import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';

import Dashboard from './Pages/Dashboard/Dashboard';
import Checkout from './Pages/Checkout/checkout';
import Home from './Pages/Home/Home';
import ConfirmOrder from './Pages/ConfirmOrder/ConfirmOrder';
import SignIn from './Pages/Signin/SignIn';
import SignUp from './Pages/SignUp/SignUp';
import Product from './Pages/Product/Product';
import ProductReturns from './Pages/ProductReturns/ProductReturns';
import ProductReview from './Pages/ProductReview/ProductReview';
import ViewOrder from './Pages/ViewOrder/ViewOrder';
import EmptyWishlist from './Pages/wishlist/EmptyWishlist';
import WishlistPage from './Pages/wishlistpage/wishlistpage'; // ✅ added
import PersonalInformation from './Pages/PersonalInformations/PersonalInformation'; // ✅ added
import Notifications from './Components/Notifications/Notifications';
import OrderTracking from './Pages/OrderTracking/OrderTracking';
import ShopPage from "./Pages/Shop/Shop";
import CartPage from "./Pages/Cart/cart";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />  {/* <-- Default page */}
          <Route path="/home" element={<Home />} />
          <Route path="/signin" element={<SignIn />} /> {/* <-- Added back */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/confirmorder" element={<ConfirmOrder />} />
          <Route path="/confirmorder/:id" element={<ConfirmOrder />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/product/:id/review" element={<ProductReview />} />
          <Route path="/product/:id/returns" element={<ProductReturns />} />
          <Route path="/vieworder" element={<ViewOrder />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<EmptyWishlist />} />
          <Route path="/wishlistpage" element={<WishlistPage />} /> {/* ✅ */}
          <Route path="/personal-info" element={<PersonalInformation />} /> {/* ✅ */}
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
          <Route path="/order-tracking" element={<Navigate to="/dashboard" />} />

          {/* Add more routes as needed */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
