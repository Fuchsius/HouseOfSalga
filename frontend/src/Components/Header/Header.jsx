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
  const [showActionPrompt, setShowActionPrompt] = useState(false);

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
        setShowActionPrompt(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (type) => {
    if (type === 'women') {
      setShowWomenDropdown((prev) => !prev);
    }
  };

  const handleDropdownItemClick = () => {
    if (!isLoggedIn) {
      setShowActionPrompt(true);
    } else {
      setShowWomenDropdown(false);
      setShowUserMenu(false);
    }
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
            <Link to="/home" className="logo-link">Salga</Link>
          </div>

          <nav className="nav-links">
            <Link to="/home" className="nav-item hover-link">Home</Link>

            <div className="dropdown-wrapper">
              <span className="nav-item hover-link" onClick={() => toggleDropdown('women')}>
                Women
                <img src={dropdownIcon} alt="dropdown" className="dropdown-icon" />
              </span>

              {showWomenDropdown && (
                <div className="dropdown-menu">
                  <div onClick={handleDropdownItemClick}>Kurtha</div>
                  <div onClick={handleDropdownItemClick}>Saree</div>
                  <div onClick={handleDropdownItemClick}>Shalva</div>
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
              onClick={() => setShowUserMenu((prev) => !prev)}
            />
            {showUserMenu && (
              <div className="user-popup-menu">
                {isLoggedIn ? (
                  <>
                    <p className="greeting">Hello {username || 'User'},</p>
                    <p className="subtext">Welcome to your account</p>
                  </>
                ) : (
                  <>
                    <p className="greeting">Hello Guest,</p>
                    <p className="subtext">Please login for full access</p>
                  </>
                )}

                <div className="user-popup-links">
                  {isLoggedIn ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <div className="user-menu-item" onClick={handleDropdownItemClick}>👤 Personal Information</div>
                      <div className="user-menu-item" onClick={handleDropdownItemClick}>📦 My Orders</div>
                    </>
                  )}
                  <div className="user-menu-item" onClick={handleDropdownItemClick}>🤍 My Wishlist</div>
                  <div className="user-menu-item" onClick={handleDropdownItemClick}>🔔 Notifications</div>
                  {isLoggedIn && (
                    <div className="user-menu-item" onClick={handleLogout}>↩ Sign Out</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <img src={cartIcon} alt="Cart" className="icon" />
          <img src={favIcon} alt="Favorite" className="icon fav-icon" />
        </div>
      </div>

      {showMobileMenu && (
        <div className="mobile-menu">
          <Link to="/home" className="mobile-menu-item">Home</Link>

          <div className="dropdown-wrapper">
            <div className="mobile-menu-item" onClick={() => toggleDropdown('women')}>
              Women
              <img src={dropdownIcon} alt="dropdown" className="dropdown-icon" />
            </div>

            {showWomenDropdown && (
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

      {showActionPrompt && (
        <div className="login-popup action-popup">
          <p>Please log in or create an account to access this feature</p>
          <div className="action-buttons">
            <button onClick={() => navigate('/')}>Login</button>
            <button onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
