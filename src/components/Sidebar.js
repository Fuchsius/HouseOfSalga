import { FaUser, FaBoxOpen, FaHeart, FaBell, FaSignOutAlt } from 'react-icons/fa';
import './styles/Sidebar.css';

export default function Sidebar() {
  return (
    <div className="sidebar-container">
      <div className="breadcrumbs">
        Home &gt; My Account &gt; <strong>My Info</strong>
      </div>

      <div className="sidebar-header">Hello Amanda,</div>
      <div className="sidebar-subtext">Welcome to your account</div>

      <div className="menu-box">
        <div className="menu-item">
          <FaUser />
          Personal Information
        </div>
        <div className="menu-item">
          <FaBoxOpen />
          My Orders
        </div>
        <div className="menu-item active">
          <FaHeart />
          My Wishlists
        </div>
        <div className="menu-item">
          <FaBell />
          Notifications
        </div>
        <div className="menu-item">
          <FaSignOutAlt />
          Sign Out
        </div>
      </div>
    </div>
  );
}
