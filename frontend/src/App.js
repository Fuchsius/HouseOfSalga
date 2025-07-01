import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';

import Dashboard from './Pages/Dashboard/Dashboard';

import Home from './Pages/Home/Home';
import ConfirmOrder from './Pages/ConfirmOrder/ConfirmOrder';
import SignIn from './Pages/Signin/SignIn';
import SignUp from './Pages/SignUp/SignUp';
import Product from './Pages/Product/Product';
import ViewOrder from './Pages/ViewOrder/ViewOrder';
import Shop from './Pages/Shop/Shop';



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
          <Route path="/vieworder" element={<ViewOrder />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more routes as needed */}
        </Routes>

        
      </div>
    </BrowserRouter>
  );
}

export default App;
