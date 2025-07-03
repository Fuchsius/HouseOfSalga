import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WishlistPage from './wishlistpage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/wishlist" />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
