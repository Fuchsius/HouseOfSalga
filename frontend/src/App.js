import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
import Shop from './Pages/Shop/Shop';
import EmptyWishlist from './Pages/wishlist/EmptyWishlist';



function App() {
  return (
    <BrowserRouter>
      <div className="App">
        

        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/confirmorder" element={<ConfirmOrder />} />
          <Route path="/confirmorder/:id" element={<ConfirmOrder />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/returns" element={<ProductReturns />} />
          <Route path="/product/review" element={<ProductReview />} />
          <Route path="/vieworder" element={<ViewOrder />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checkout" element={<Checkout />} />
         <Route path="/wishlist" element={<EmptyWishlist />} />
          {/* Add more routes as needed */}
        </Routes>

        
      </div>
    </BrowserRouter>
  );
}

export default App;
