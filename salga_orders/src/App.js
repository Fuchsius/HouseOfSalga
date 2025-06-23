import React from 'react';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter } from 'react-router-dom'; // Ensure react-router is used
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Dashboard />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
