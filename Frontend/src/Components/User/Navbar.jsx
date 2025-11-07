import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link, useLocation } from "react-router-dom";
import './Navbar.css';
import { scrollToTop } from '../../Pages/scrollToTop';
import { AuthContext } from '../../Context/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const profileDropdownRef = useRef(null);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const closeProfileDropdown = () => setIsProfileDropdownOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const location = useLocation();
  const currentPath = location.pathname;

  const { isLoggedIn, user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    closeProfileDropdown();
    closeMobileMenu();
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__logo">
          <Link to="/" className="navbar__logo-text" onClick={scrollToTop}>CampusEase</Link>
        </div>

        {/* Desktop Links */}
        <ul className="navbar__desktop-links">
          <li><Link className={`navbar__link ${currentPath === "/" ? "navbar__link--active" : ""}`} to="/" onClick={scrollToTop}>Home</Link></li>
          <li><Link className={`navbar__link ${currentPath === "/accommodation" ? "navbar__link--active" : ""}`} to="/accommodation" onClick={scrollToTop}>Accommodation</Link></li>
          <li><Link className={`navbar__link ${currentPath === "/transport" ? "navbar__link--active" : ""}`} to="/transport" onClick={scrollToTop}>Transport</Link></li>
          <li><Link className={`navbar__link ${currentPath === "/about" ? "navbar__link--active" : ""}`} to="/about" onClick={scrollToTop}>About</Link></li>
          <li><Link className={`navbar__link ${currentPath === "/contact" ? "navbar__link--active" : ""}`} to="/contact" onClick={scrollToTop}>Contact</Link></li>
        </ul>

        {/* Profile / Login */}
        <div className="navbar__profile-section" ref={profileDropdownRef}>
          {isLoggedIn ? (
            <div onClick={toggleProfileDropdown} className='navbar__profile'>
              <button className="navbar__profile-button" aria-label="Profile menu">
                {user?.dp ? (
                  <img src={user.dp} alt="Profile" className="navbar__profile-image" />
                ) : (
                  <div className="navbar__profile-placeholder">{user?.fullName?.charAt(0)?.toUpperCase()}</div>
                )}
              </button>

              <div className={`navbar__profile-dropdown ${isProfileDropdownOpen ? 'navbar__profile-dropdown--open' : ''}`}>
                <Link className={`navbar__dropdown-link ${currentPath === "/profile" ? "navbar__dropdown-link--active" : ""}`} to="/profile" onClick={() => { closeProfileDropdown(); scrollToTop(); }}>Profile</Link>

                {(user?.role === 'student' || user?.role === 'lecturer') && (
                  <>
                    <Link className={`navbar__dropdown-link ${currentPath === "/saved" ? "navbar__dropdown-link--active" : ""}`} to="/saved" onClick={() => { closeProfileDropdown(); scrollToTop(); }}>Saved</Link>
                    <Link className={`navbar__dropdown-link ${currentPath === "/booking" ? "navbar__dropdown-link--active" : ""}`} to="/booking" onClick={() => { closeProfileDropdown(); scrollToTop(); }}>Booking</Link>
                  </>
                )}

                {user?.role === 'admin' && (
                  <Link className={`navbar__dropdown-link ${currentPath === "/admin" ? "navbar__dropdown-link--active" : ""}`} to="/admin" onClick={() => { closeProfileDropdown(); scrollToTop(); }}>Admin Dashboard</Link>
                )}

                <Link className="navbar__dropdown-link" to="/" onClick={handleLogout}>Logout</Link>
              </div>
            </div>
          ) : (
            <Link to="/login" className="navbar__auth-button">Login</Link>
          )}
        </div>

        <button onClick={toggleMobileMenu} className="navbar__mobile-toggle" aria-label="Toggle menu" aria-expanded={isMobileMenuOpen ? "true" : "false"}>☰</button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="navbar__mobile-menu">
          <ul className="navbar__mobile-links">
            <li><Link className={`navbar__mobile-link ${currentPath === "/" ? "navbar__mobile-link--active" : ""}`} to="/" onClick={closeMobileMenu}>Home</Link></li>
            <li><Link className={`navbar__mobile-link ${currentPath === "/accommodation" ? "navbar__mobile-link--active" : ""}`} to="/accommodation" onClick={closeMobileMenu}>Accommodation</Link></li>
            <li><Link className={`navbar__mobile-link ${currentPath === "/transport" ? "navbar__mobile-link--active" : ""}`} to="/transport" onClick={closeMobileMenu}>Transport</Link></li>
            <li><Link className={`navbar__mobile-link ${currentPath === "/about" ? "navbar__mobile-link--active" : ""}`} to="/about" onClick={closeMobileMenu}>About</Link></li>
            <li><Link className={`navbar__mobile-link ${currentPath === "/contact" ? "navbar__mobile-link--active" : ""}`} to="/contact" onClick={closeMobileMenu}>Contact</Link></li>

            {isLoggedIn && (
              <>
                <li><Link className={`navbar__mobile-link ${currentPath === "/profile" ? "navbar__mobile-link--active" : ""}`} to="/profile" onClick={closeMobileMenu}>Profile</Link></li>
                {(user?.role === 'student' || user?.role === 'lecturer') && (
                  <>
                    <li><Link className={`navbar__mobile-link ${currentPath === "/saved" ? "navbar__mobile-link--active" : ""}`} to="/saved" onClick={closeMobileMenu}>Saved</Link></li>
                    <li><Link className={`navbar__mobile-link ${currentPath === "/booking" ? "navbar__mobile-link--active" : ""}`} to="/booking" onClick={closeMobileMenu}>Booking</Link></li>
                  </>
                )}
                {user?.role === 'admin' && (
                  <li><Link className={`navbar__mobile-link ${currentPath === "/admin" ? "navbar__mobile-link--active" : ""}`} to="/admin" onClick={closeMobileMenu}>Admin Dashboard</Link></li>
                )}
              </>
            )}
          </ul>

          {isLoggedIn ? (
            <Link to="/" className="navbar__mobile-auth-button" onClick={handleLogout}>Log Out</Link>
          ) : (
            <Link to="/login" className="navbar__mobile-auth-button" onClick={closeMobileMenu}>Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
