import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link, useLocation } from "react-router-dom";
import './AdminNavbar.css';
import { scrollToTop } from '../../Pages/scrollToTop';
import { AuthContext } from '../../Context/AuthContext';

const AdminNavbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
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
                    <Link to="/admin" className="navbar__logo-text" onClick={scrollToTop}>CampusEase Admin</Link>
                </div>

                <ul className="navbar__desktop-links">
                    <li>
                        <Link className={`navbar__link ${currentPath === "/admin" ? "navbar__link--active" : ""}`} to="/admin" onClick={scrollToTop}>Dashboard</Link>
                    </li>
                    <li>
                        <Link className={`navbar__link ${currentPath === "/admin/room" ? "navbar__link--active" : ""}`} to="/admin/room" onClick={scrollToTop}>Room</Link>
                    </li>
                    <li>
                        <Link className={`navbar__link ${currentPath === "/admin/transport" ? "navbar__link--active" : ""}`} to="/admin/transport" onClick={scrollToTop}>Transport</Link>
                    </li>
                    <li>
                        <Link className={`navbar__link ${currentPath === "/admin/owner" ? "navbar__link--active" : ""}`} to="/admin/owner" onClick={scrollToTop}>Owner</Link>
                    </li>
                </ul>

                <div className="navbar__profile-section" ref={profileDropdownRef}>
                    {isLoggedIn ? (
                        <>
                            <button
                                onClick={toggleProfileDropdown}
                                className="navbar__profile-button"
                                aria-label="Profile menu"
                                aria-expanded={isProfileDropdownOpen ? "true" : "false"}
                            >
                                {user?.dp && (
                                    <img
                                        src={user.dp}
                                        alt="Profile"
                                        className="navbar__profile-image"
                                    />
                                )}
                            </button>

                            <div className={`navbar__profile-dropdown ${isProfileDropdownOpen ? 'navbar__profile-dropdown--open' : ''}`}>
                                <Link
                                    className={`navbar__dropdown-link ${currentPath === "/profile" ? "navbar__dropdown-link--active" : ""}`}
                                    to="/profile"
                                    onClick={() => {
                                        closeProfileDropdown();
                                        scrollToTop();
                                    }}
                                >
                                    Profile
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

                <button
                    onClick={toggleMobileMenu}
                    className="navbar__mobile-toggle"
                    aria-label="Toggle menu"
                    aria-expanded={isMobileMenuOpen ? "true" : "false"}
                >
                    ☰
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="navbar__mobile-menu">
                    <ul className="navbar__mobile-links">
                        <li>
                            <Link
                                className={`navbar__mobile-link ${currentPath === "/admin" ? "navbar__mobile-link--active" : ""}`}
                                to="/admin"
                                onClick={closeMobileMenu}
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={`navbar__mobile-link ${currentPath === "/admin/room" ? "navbar__mobile-link--active" : ""}`}
                                to="/admin/room"
                                onClick={closeMobileMenu}
                            >
                                Room
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={`navbar__mobile-link ${currentPath === "/admin/transport" ? "navbar__mobile-link--active" : ""}`}
                                to="/admin/transport"
                                onClick={closeMobileMenu}
                            >
                                Transport
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={`navbar__mobile-link ${currentPath === "/admin/owner" ? "navbar__mobile-link--active" : ""}`}
                                to="/admin/owner"
                                onClick={closeMobileMenu}
                            >
                                Owner
                            </Link>
                        </li>
                      
                        {isLoggedIn && (
                            <li>
                                <Link
                                    className={`navbar__mobile-link ${currentPath === "/profile" ? "navbar__mobile-link--active" : ""}`}
                                    to="/profile"
                                    onClick={closeMobileMenu}
                                >
                                    Profile
                                </Link>
                            </li>
                        )}
                    </ul>

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

export default AdminNavbar;