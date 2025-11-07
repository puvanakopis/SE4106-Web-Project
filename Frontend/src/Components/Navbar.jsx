import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import './Navbar.css';
import { AuthContext } from '../Context/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
 const navigator= useNavigate()
  const profileDropdownRef = useRef(null);

  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const location = useLocation();
  const currentPath = location.pathname;

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const toggleProfileDropdown = () => setIsProfileDropdownOpen(prev => !prev);
  const closeProfileDropdown = () => setIsProfileDropdownOpen(false);

  const handleLogout = () => {
    logout();
    closeProfileDropdown();
    closeMobileMenu();
    navigator('/')
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const adminLinks = [
    { to: "/", label: "Dashboard" },
    { to: "/room", label: "Room" },
    { to: "/transport", label: "Transport" },
    { to: "/owner", label: "Owner" },
  ];

  const userLinks = [
    { to: "/", label: "Home" },
    { to: "/accommodation", label: "Accommodation" },
    { to: "/transport", label: "Transport" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const profileLinks = () => {
    if (!user) return [];
    if (user.role === 'admin') {
      return [{ to: "/profile", label: "Profile" }];
    } else if (user.role === 'student' || user.role === 'lecturer') {
      return [
        { to: "/profile", label: "Profile" },
        { to: "/saved", label: "Saved" },
        { to: "/booking", label: "Booking" },
      ];
    }
    return [];
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__logo">
          <Link
            to={user?.role === 'admin' ? "/" : "/"}
            className="navbar__logo-text"
          >
            {user?.role === 'admin' ? "CampusEase Admin" : "CampusEase"}
          </Link>
        </div>

        {/* Desktop Links */}
        <ul className="navbar__desktop-links">
          {(user?.role === 'admin' ? adminLinks : userLinks).map((link) => (
            <li key={link.to}>
              <Link
                className={`navbar__link ${currentPath === link.to ? "navbar__link--active" : ""}`}
                to={link.to}              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Profile Section */}
        <div className="navbar__profile-section" ref={profileDropdownRef}>
          {isLoggedIn ? (
            <>
              <button
                onClick={toggleProfileDropdown}
                className="navbar__profile-button"
                aria-label="Profile menu"
                aria-expanded={isProfileDropdownOpen ? "true" : "false"}
              >
                {user?.photo ? (
                  <img src={`http://localhost:5000/${user.photo}`} alt="Profile" className="navbar__profile-image" />
                ) : (
                  <div className="navbar__profile-placeholder">
                    {user?.fullName?.[0]?.toUpperCase()}
                  </div>
                )}
              </button>

              <div className={`navbar__profile-dropdown ${isProfileDropdownOpen ? 'navbar__profile-dropdown--open' : ''}`}>
                {profileLinks().map((link) => (
                  <Link
                    key={link.to}
                    className={`navbar__dropdown-link ${currentPath === link.to ? "navbar__dropdown-link--active" : ""}`}
                    to={link.to}
                    onClick={() => {
                      closeProfileDropdown();
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
                <button className="navbar__dropdown-link" onClick={handleLogout}>Logout</button>
              </div>
            </>
          ) : (
            <Link to="/login" className="navbar__auth-button">Login</Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMobileMenu}
          className="navbar__mobile-toggle"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen ? "true" : "false"}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="navbar__mobile-menu">
          <ul className="navbar__mobile-links">
            {(user?.role === 'admin' ? adminLinks : userLinks).map((link) => (
              <li key={link.to}>
                <Link
                  className={`navbar__mobile-link ${currentPath === link.to ? "navbar__mobile-link--active" : ""}`}
                  to={link.to}
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {isLoggedIn && profileLinks().map((link) => (
              <li key={link.to}>
                <Link
                  className={`navbar__mobile-link ${currentPath === link.to ? "navbar__mobile-link--active" : ""}`}
                  to={link.to}
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {isLoggedIn ? (
            <button className="navbar__mobile-auth-button" onClick={handleLogout}>Log Out</button>
          ) : (
            <Link to="/login" className="navbar__mobile-auth-button" onClick={closeMobileMenu}>Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;