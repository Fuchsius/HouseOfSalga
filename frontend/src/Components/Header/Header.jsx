import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import dropdownIcon from '../../Assets/drop-down.png';
import searchIcon from '../../Assets/magnifyingglass.png';
import userIcon from '../../Assets/user.png';
import cartIcon from '../../Assets/Frame 2609102 (1).png';
import favIcon from '../../Assets/bag-04 (1).png';

function Header() {
  const [showWomenDropdown, setShowWomenDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const wrapperRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('username');
    setIsLoggedIn(!!token);
    setUsername(name || '');
  }, [location]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowWomenDropdown(false);
        setShowMobileMenu(false);
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (type) => {
    if (!isLoggedIn) return triggerLoginPopup();
    if (type === 'women') {
      setShowWomenDropdown((prev) => !prev);
    }
  };

  const triggerLoginPopup = () => {
    setShowLoginPopup(true);
    setTimeout(() => setShowLoginPopup(false), 1500);
  };

  const handleDropdownItemClick = () => {
    setShowWomenDropdown(false);
    setShowUserMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    setShowUserMenu(false);
    navigate('/signup');
  };

  return (
    <header className="header" ref={wrapperRef}>
      <div className="header-container">
        <div className="hamburger" onClick={() => setShowMobileMenu((prev) => !prev)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="left-section">
          <div className="logo">
            {isLoggedIn ? (
              <Link to="/home" className="logo-link">Salga</Link>
            ) : (
              <span className="logo-link" onClick={triggerLoginPopup}>Salga</span>
            )}
          </div>

          <nav className="nav-links">
            {isLoggedIn ? (
              <Link to="/home" className="nav-item hover-link">Home</Link>
            ) : (
              <span className="nav-item hover-link" onClick={triggerLoginPopup}>Home</span>
            )}

            <div className="dropdown-wrapper">
              <span className="nav-item hover-link" onClick={() => toggleDropdown('women')}>
                Women
                <img src={dropdownIcon} alt="dropdown" className="dropdown-icon" />
              </span>

              {isLoggedIn && showWomenDropdown && (
                <div className="dropdown-menu">
                  <div onClick={handleDropdownItemClick}>Dresses</div>
                  <div onClick={handleDropdownItemClick}>Shoes</div>
                  <div onClick={handleDropdownItemClick}>Accessories</div>
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className="right-section">
          <div className="search-bar">
            <img src={searchIcon} alt="search" className="search-icon" />
            <input type="text" placeholder="Search" />
          </div>

          {isLoggedIn ? (
            <span className="nav-item hover-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>
              Sign Out
            </span>
          ) : (
            <Link to="/" className="nav-item hover-link">Login</Link>
          )}

          <div className="user-menu-wrapper">
            <img
              src={userIcon}
              alt="User"
              className="icon user-icon"
              onClick={() => {
                if (isLoggedIn) setShowUserMenu((prev) => !prev);
                else triggerLoginPopup();
              }}
            />
            {isLoggedIn && showUserMenu && (
              <div className="user-popup-menu">
                <p className="greeting">Hello {username || 'User'},</p>
                <p className="subtext">Welcome to your account</p>

                <div className="user-popup-links">
                  <Link
                    to="/personal-info"
                    className="user-menu-item"
                    onClick={handleDropdownItemClick}
                  >
                    👤 Personal Information
                  </Link>

                  <Link
                    to="/dashboard"
                    className={`user-menu-item ${location.pathname === "/dashboard" ? "active" : ""}`}
                    onClick={handleDropdownItemClick}
                  >
                    📦 My Orders
                  </Link>

                  <div className="user-menu-item">🤍 My Wishlist</div>
                  <div className="user-menu-item">🔔 Notifications</div>
                  <div className="user-menu-item" onClick={handleLogout}>↩ Sign Out</div>
                </div>
              </div>
            )}
          </div>

          <img
            src={cartIcon}
            alt="Cart"
            className="icon"
            onClick={() => {
              if (!isLoggedIn) triggerLoginPopup();
            }}
          />
          <img
            src={favIcon}
            alt="Favorite"
            className="icon fav-icon"
            onClick={() => {
              if (!isLoggedIn) triggerLoginPopup();
            }}
          />
        </div>
      </div>

      {showMobileMenu && (
        <div className="mobile-menu">
          {isLoggedIn ? (
            <Link to="/home" className="mobile-menu-item">Home</Link>
          ) : (
            <span className="mobile-menu-item" onClick={triggerLoginPopup}>Home</span>
          )}

          <div className="dropdown-wrapper">
            <div className="mobile-menu-item" onClick={() => toggleDropdown('women')}>
              Women
              <img src={dropdownIcon} alt="dropdown" className="dropdown-icon" />
            </div>

            {isLoggedIn && showWomenDropdown && (
              <div className="dropdown-menu">
                <div onClick={handleDropdownItemClick}>Dresses</div>
                <div onClick={handleDropdownItemClick}>Shoes</div>
                <div onClick={handleDropdownItemClick}>Accessories</div>
              </div>
            )}
          </div>

          {!isLoggedIn ? (
            <Link to="/" className="mobile-menu-item">Login</Link>
          ) : (
            <div className="mobile-menu-item" onClick={handleLogout}>Sign Out</div>
          )}
        </div>
      )}

      {showLoginPopup && (
        <div className="login-popup">
          Please login first!
        </div>
      )}
    </header>
  );
}

export default Header;
