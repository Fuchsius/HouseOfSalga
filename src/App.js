import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Product from './pages/Product/Product';
import ProductReturns from './pages/ProductReturns/ProductReturns';
import ProductReview from './pages/ProductReview/ProductReview';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Header/>
      <main className="main-content">
        <div className="container">
          <Routes>
            {/* Add a default route that redirects to one of your pages */}
            <Route path="/" element={<Navigate to="/product" replace />} />
            <Route path="/product" element={<Product />} />
            <Route path="/product/returns" element={<ProductReturns />} />
            <Route path="/product/review" element={<ProductReview />} />
          </Routes>
        </div>
        <Footer/>
      </main>
    </Router>
  );
}

export default App;