import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import './AdminNavbar.css';
import { AuthContext } from '../../Context/AuthContext';

const AdminNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const profileDropdownRef = useRef(null);
    const location = useLocation();
    const currentPath = location.pathname;
    const navigate = useNavigate();
    const { isLoggedIn, validUser, logout } = useContext(AuthContext);

    const scrollNavigate = (to) => {
        navigate(to);
        window.scrollTo(0, 0);
    };

    const toggleMenu = () => {
        if (isMenuOpen) {
            setIsClosing(true);
            setTimeout(() => {
                setIsMenuOpen(false);
                setIsClosing(false);
            }, 300);
        } else {
            setIsMenuOpen(true);
        }
    };

    const closeMenu = () => {
        if (isMenuOpen) {
            setIsClosing(true);
            setTimeout(() => {
                setIsMenuOpen(false);
                setIsClosing(false);
            }, 300);
        }
    };

    const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
    const closeProfileDropdown = () => setIsProfileDropdownOpen(false);

    const handleLogout = () => {
        logout();
        closeProfileDropdown();
        closeMenu();
        scrollNavigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="admin-navbar">
            <div className="admin-navbar__container">

                {/* Logo */}
                <div className="admin-navbar__logo">
                    <span onClick={() => scrollNavigate('/admin')} className="admin-navbar__logo-text cursor-pointer">CampusEase</span>
                </div>

                {/* Desktop Navigation */}
                <ul className="admin-navbar__desktop-links">
                    <li><span onClick={() => scrollNavigate('/admin')} className={`admin-navbar__link cursor-pointer ${currentPath === "/admin" ? "admin-navbar__link--active" : ""}`}>Dashboard</span></li>
                    <li><span onClick={() => scrollNavigate('/admin/room')} className={`admin-navbar__link cursor-pointer ${currentPath === "/admin/room" ? "admin-navbar__link--active" : ""}`}>Room</span></li>
                    <li><span onClick={() => scrollNavigate('/admin/transport')} className={`admin-navbar__link cursor-pointer ${currentPath === "/admin/transport" ? "admin-navbar__link--active" : ""}`}>Transport</span></li>
                    <li><span onClick={() => scrollNavigate('/admin/owner')} className={`admin-navbar__link cursor-pointer ${currentPath === "/admin/owner" ? "admin-navbar__link--active" : ""}`}>Owner</span></li>
                </ul>

                {/* Profile Section */}
                <div className="admin-navbar__profile-section" ref={profileDropdownRef}>
                    {isLoggedIn ? (
                        <>
                            <button
                                onClick={toggleProfileDropdown}
                                className="admin-navbar__profile-button"
                                aria-label="Profile menu"
                                aria-expanded={isProfileDropdownOpen ? "true" : "false"}
                            >
                                {validUser?.dp ? (
                                    <img
                                        src={validUser.dp}
                                        alt="Profile"
                                        className="admin-navbar__profile-image"
                                    />
                                ) : (
                                    <div className="admin-navbar__profile-initial">
                                        {validUser?.name?.charAt(0).toUpperCase() || 'A'}
                                    </div>
                                )}
                            </button>

                            <div className={`admin-navbar__profile-dropdown ${isProfileDropdownOpen ? 'admin-navbar__profile-dropdown--open' : ''}`}>
                                <span
                                    onClick={() => { closeProfileDropdown(); scrollNavigate('/admin/profile'); }}
                                    className={`admin-navbar__dropdown-link ${currentPath === "/admin/profile" ? "admin-navbar__dropdown-link--active" : ""}`}
                                >
                                    Profile
                                </span>
                                <span
                                    onClick={handleLogout}
                                    className="admin-navbar__dropdown-link"
                                >
                                    Logout
                                </span>
                            </div>
                        </>
                    ) : (
                        <span onClick={() => scrollNavigate('/login')} className="admin-navbar__auth-button">
                            Login
                        </span>
                    )}
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                    onClick={toggleMenu}
                    className="admin-navbar__mobile-toggle"
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen ? "true" : "false"}
                >
                    ☰
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className={`admin-navbar__mobile-menu ${isClosing ? 'admin-navbar__mobile-menu--closing' : ''}`}>
                    <ul className="admin-navbar__mobile-links">
                        <li><span onClick={() => { closeMenu(); scrollNavigate('/admin'); }} className={`admin-navbar__mobile-link ${currentPath === "/admin" ? "admin-navbar__mobile-link--active" : ""}`}>Dashboard</span></li>
                        <li><span onClick={() => { closeMenu(); scrollNavigate('/admin/room'); }} className={`admin-navbar__mobile-link ${currentPath === "/admin/room" ? "admin-navbar__mobile-link--active" : ""}`}>Room</span></li>
                        <li><span onClick={() => { closeMenu(); scrollNavigate('/admin/transport'); }} className={`admin-navbar__mobile-link ${currentPath === "/admin/transport" ? "admin-navbar__mobile-link--active" : ""}`}>Transport</span></li>
                        <li><span onClick={() => { closeMenu(); scrollNavigate('/admin/owner'); }} className={`admin-navbar__mobile-link ${currentPath === "/admin/owner" ? "admin-navbar__mobile-link--active" : ""}`}>Owner</span></li>
                        {isLoggedIn && (
                            <li><span onClick={() => { closeMenu(); scrollNavigate('/admin/profile'); }} className={`admin-navbar__mobile-link ${currentPath === "/admin/profile" ? "admin-navbar__mobile-link--active" : ""}`}>Profile</span></li>
                        )}
                    </ul>

                    {/* Auth Button for Mobile */}
                    {isLoggedIn ? (
                        <span onClick={() => { closeMenu(); handleLogout(); }} className="admin-navbar__mobile-auth-button">
                            Log Out
                        </span>
                    ) : (
                        <span onClick={() => { closeMenu(); scrollNavigate('/login'); }} className="admin-navbar__mobile-auth-button">
                            Sign In
                        </span>
                    )}
                </div>
            )}
        </nav>
    );
};

export default AdminNavbar;