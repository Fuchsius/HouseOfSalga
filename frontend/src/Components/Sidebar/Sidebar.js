import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiPackage,
  FiHeart,
  FiBell,
  FiLogOut,
} from "react-icons/fi";

import "./Sidebar.css";

const links = [
  { label: "Personal Information", icon: <FiUser /> },
  { label: "My Orders", icon: <FiPackage />, active: true },
  { label: "My Wishlist", icon: <FiHeart /> },
  { label: "Notifications", icon: <FiBell /> },
  { label: "Sign Out", icon: <FiLogOut /> },
];

export default function Sidebar({ onMyAccountClick }) {
  const navigate = useNavigate();

  const handleMyOrdersClick = () => {
    // Reload the current page
    navigate(0);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="breadcrumb-wrapper">
          {/* Home link */}
          <Link to="/home" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-divider">/</span>

          {/* My Account opens user popup menu */}
          <span
            className="breadcrumb-link clickable"
            onClick={onMyAccountClick}
          >
            My Account
          </span>

          <span className="breadcrumb-divider">/</span>

          {/* Clicking My Orders reloads the page */}
          <span
            className="breadcrumb-link clickable"
            onClick={handleMyOrdersClick}
          >
            My Orders
          </span>
        </div>

        <h3>Hello Amanda,</h3>
        <p className="subtitle">Welcome to your account</p>
      </div>

      <div className="nav-box">
        <ul className="nav-links">
          {links.map(({ label, icon, active }) => (
            <li key={label} className={active ? "active" : ""}>
              <button className="sidebar-btn">
                {icon}
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
