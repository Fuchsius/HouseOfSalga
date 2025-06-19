import React, { useState, useEffect, useRef } from 'react';
import './Header.css';

import dropdownIcon from '../images/drop-down.png';
import searchIcon from '../images/magnifyingglass.png';
import userIcon from '../images/user.png';
import cartIcon from '../images/Frame 2609102 (1).png';
import favIcon from '../images/bag-04 (1).png';

function Header() {
  const [showWomenDropdown, setShowWomenDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowWomenDropdown(false);
        setShowLanguageDropdown(false);
        setShowMobileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleWomenDropdown = () => {
    setShowWomenDropdown((prev) => !prev);
    setShowLanguageDropdown(false);
  };

  const toggleLanguageDropdown = () => {
    setShowLanguageDropdown((prev) => !prev);
    setShowWomenDropdown(false);
  };

  const handleDropdownItemClick = () => {
    setShowWomenDropdown(false);
    setShowLanguageDropdown(false);
  };

  return (
    <header className="header" ref={wrapperRef}>
      <div className="header-container">
        <div
          className="hamburger"
          onClick={() => setShowMobileMenu((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="left-section">
          <div className="logo">Salga</div>

          <nav className="nav-links">
            <span className="nav-item hover-link">Home</span>

            <div className="dropdown-wrapper">
              <span className="nav-item hover-link" onClick={toggleWomenDropdown}>
                Women
                <img src={dropdownIcon} alt="dropdown" className="dropdown-icon" />
              </span>

              {showWomenDropdown && (
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

          <span className="nav-item hover-link">Login</span>
          <img src={userIcon} alt="User" className="icon" />
          <img src={cartIcon} alt="Cart" className="icon" />
          <img src={favIcon} alt="Favorite" className="icon fav-icon" />

          <div className="dropdown-wrapper">
            <span className="nav-item hover-link" onClick={toggleLanguageDropdown}>
              Language
              <img src={dropdownIcon} alt="dropdown" className="dropdown-icon" />
            </span>

            {showLanguageDropdown && (
              <div className="dropdown-menu">
                <div onClick={handleDropdownItemClick}>English</div>
                <div onClick={handleDropdownItemClick}>Sinhala</div>
                <div onClick={handleDropdownItemClick}>Tamil</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showMobileMenu && (
        <div className="mobile-menu">
          <div className="mobile-menu-item">Home</div>

          <div className="dropdown-wrapper">
            <div className="mobile-menu-item" onClick={toggleWomenDropdown}>
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

          <div className="mobile-menu-item">Login</div>

          <div className="dropdown-wrapper">
            <div className="mobile-menu-item" onClick={toggleLanguageDropdown}>
              Language
              <img src={dropdownIcon} alt="dropdown" className="dropdown-icon" />
            </div>

            {showLanguageDropdown && (
              <div className="dropdown-menu">
                <div onClick={handleDropdownItemClick}>English</div>
                <div onClick={handleDropdownItemClick}>Sinhala</div>
                <div onClick={handleDropdownItemClick}>Tamil</div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
