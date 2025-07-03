import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WishlistPage from './wishlist';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/wishlist" replace />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
    </Router>
  );
}

export default App;
