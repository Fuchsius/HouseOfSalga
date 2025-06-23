import React from "react";
import Breadcrumbs from './Breadcrumbs';

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

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* ✅ Breadcrumbs */}
      <div className="sidebar-header">
        <Breadcrumbs paths={['Home', 'My Account', 'My Orders']} />
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
