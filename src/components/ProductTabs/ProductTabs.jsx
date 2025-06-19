import React from 'react';
import { NavLink } from 'react-router-dom';
import './ProductTabs.css';

const ProductTabs = () => {
  return (
    <div className="tabs-container">
      <div className="product-tabs">
        <NavLink 
          to="/product" 
          className={({ isActive }) => isActive ? "tab active" : "tab"}
          end
        >
          Description
        </NavLink>
        <NavLink 
          to="/product/review" 
          className={({ isActive }) => isActive ? "tab active" : "tab"}
        >
          Reviews
        </NavLink>
        <NavLink 
          to="/product/returns" 
          className={({ isActive }) => isActive ? "tab active" : "tab"}
        >
          Returns
        </NavLink>
      </div>
    </div>
  );
};

export default ProductTabs;