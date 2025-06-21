import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Import your components/pages
import SignUp from './pages/SignUp';          // Main signup form
import SignUpPage from './pages/Sign-Up';     // Alternate sign-up page
import SignIn from './pages/SignIn';          // Sign-in page

// ✅ Import Himasha Pages
import Home from './HimashaPages/Home';
import ConfirmOrder from './HimashaPages/ConfirmOrder/ConfirmOrder';

function App() {
  return (
    <Routes>
      {/* Homepage */}
      <Route path="/" element={
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <h1>Homepage</h1>
          <Link to="/signup" style={{ display: 'block', margin: '10px' }}>Go to Main Sign Up</Link>
          <Link to="/sign-up" style={{ display: 'block', margin: '10px' }}>Go to Alternate Sign-Up Page</Link>
          <Link to="/signin" style={{ display: 'block', margin: '10px' }}>Go to Sign In</Link>
        </div>
      } />

      {/* Main Sign Up Page with form */}
      <Route path="/signup" element={<SignUp />} />

      {/* Alternate Sign-Up Page (static message) */}
      <Route path="/sign-up" element={<SignUpPage />} />

      {/* Sign In Page */}
      <Route path="/signin" element={<SignIn />} />

      {/* ✅ Himasha Pages */}
      <Route path="/home" element={<Home />} />
      <Route path="/himasha-home" element={<Home />} /> {/* ✅ added for header nav */}
      <Route path="/confirmorder" element={<ConfirmOrder />} />
    </Routes>
  );
}

export default App;
