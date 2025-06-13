import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link, useLocation } from "react-router-dom";
import './Navbar.css';
import { AuthContext } from '../../Context/AuthContext';

const Navbar = () => {
    // State for mobile menu toggle 
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    // State for profile dropdown toggle 
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const profileDropdownRef = useRef(null);
    const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
    const closeProfileDropdown = () => setIsProfileDropdownOpen(false);

    // Close dropdown when clicking outside 
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Get current path for active link styling 
    const location = useLocation();
    const currentPath = location.pathname;

    // Authentication context 
    const { isLoggedIn, setIsLoggedIn, validUser } = useContext(AuthContext);
    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        closeProfileDropdown();
        closeMobileMenu();
    };

    return (
        /* ----------------- Main Navbar container ----------------- */
        <nav className="navbar">
            <div className="navbar__container">

                {/* ----------------- Logo Section ----------------- */}
                <div className="navbar__logo">
                    <Link to="/" className="navbar__logo-text">CampusEase</Link>
                </div>

                {/* ----------------- Desktop Navigation ----------------- */}
                <ul className="navbar__desktop-links">
                    <li>
                        <Link className={`navbar__link ${currentPath === "/" ? "navbar__link--active" : ""}`} to="/">Home</Link>
                    </li>
                    <li>
                        <Link className={`navbar__link ${currentPath === "/accommodation" ? "navbar__link--active" : ""}`} to="/accommodation">Accommodation</Link>
                    </li>
                    <li>
                        <Link className={`navbar__link ${currentPath === "/transport" ? "navbar__link--active" : ""}`} to="/transport">Transport</Link>
                    </li>
                    <li>
                        <Link className={`navbar__link ${currentPath === "/about" ? "navbar__link--active" : ""}`} to="/about">About</Link>
                    </li>
                    <li>
                        <Link className={`navbar__link ${currentPath === "/contact" ? "navbar__link--active" : ""}`} to="/contact">Contact</Link>
                    </li>
                </ul>

                {/*  Profile Desktop */}
                <div className="navbar__profile-section" ref={profileDropdownRef}>
                    {isLoggedIn ? (
                        <>
                            <button
                                onClick={toggleProfileDropdown}
                                className="navbar__profile-button"
                                aria-label="Profile menu"
                                aria-expanded={isProfileDropdownOpen ? "true" : "false"}
                            >
                                {validUser?.dp && (
                                    <img
                                        src={validUser.dp}
                                        alt="Profile"
                                        className="navbar__profile-image"
                                    />
                                )}
                            </button>

                            <div className={`navbar__profile-dropdown ${isProfileDropdownOpen ? 'navbar__profile-dropdown--open' : ''}`}>
                                <Link
                                    className={`navbar__dropdown-link ${currentPath === "/profile" ? "navbar__dropdown-link--active" : ""}`}
                                    to="/profile"
                                    onClick={closeProfileDropdown}
                                >
                                    Profile
                                </Link>
                                <Link
                                    className={`navbar__dropdown-link ${currentPath === "/saved" ? "navbar__dropdown-link--active" : ""}`}
                                    to="/saved"
                                    onClick={closeProfileDropdown}
                                >
                                    Saved
                                </Link>
                                <Link
                                    className="navbar__dropdown-link"
                                    to="/"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Link>
                            </div>
                        </>
                    ) : (
                        <Link to="/login" className="navbar__auth-button">
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                    onClick={toggleMobileMenu}
                    className="navbar__mobile-toggle"
                    aria-label="Toggle menu"
                    aria-expanded={isMobileMenuOpen ? "true" : "false"}
                >
                    ☰
                </button>
            </div>





            {/* ----------------- Mobile Navigation Menu ----------------- */}
            {isMobileMenuOpen && (
                <div className="navbar__mobile-menu">
                    <ul className="navbar__mobile-links">
                        <li>
                            <Link
                                className={`navbar__mobile-link ${currentPath === "/" ? "navbar__mobile-link--active" : ""}`}
                                to="/"
                                onClick={closeMobileMenu}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={`navbar__mobile-link ${currentPath === "/accommodation" ? "navbar__mobile-link--active" : ""}`}
                                to="/accommodation"
                                onClick={closeMobileMenu}
                            >
                                Accommodation
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={`navbar__mobile-link ${currentPath === "/transport" ? "navbar__mobile-link--active" : ""}`}
                                to="/transport"
                                onClick={closeMobileMenu}
                            >
                                Transport
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={`navbar__mobile-link ${currentPath === "/about" ? "navbar__mobile-link--active" : ""}`}
                                to="/about"
                                onClick={closeMobileMenu}
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={`navbar__mobile-link ${currentPath === "/contact" ? "navbar__mobile-link--active" : ""}`}
                                to="/contact"
                                onClick={closeMobileMenu}
                            >
                                Contact
                            </Link>
                        </li>
                        {isLoggedIn && (
                            <>
                                <li>
                                    <Link
                                        className={`navbar__mobile-link ${currentPath === "/profile" ? "navbar__mobile-link--active" : ""}`}
                                        to="/profile"
                                        onClick={closeMobileMenu}
                                    >
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className={`navbar__mobile-link ${currentPath === "/saved" ? "navbar__mobile-link--active" : ""}`}
                                        to="/saved"
                                        onClick={closeMobileMenu}
                                    >
                                        Saved
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Auth Button for Mobile  */}
                    {isLoggedIn ? (
                        <Link
                            to="/"
                            className="navbar__mobile-auth-button"
                            onClick={handleLogout}
                        >
                            Log Out
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="navbar__mobile-auth-button"
                            onClick={closeMobileMenu}
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;