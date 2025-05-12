import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {

    // Toggles the mobile
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // get the current URL path
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <nav className="Navbar">

            {/* ----------------- navbar container ----------------- */}
            <div className="navbar-container">

                {/* Logo */}
                <div className="logo">
                    <Link to="/" className="logo-text">CampusEase</Link>
                </div>

                {/* Desktop Menu */}
                <ul className="nav-links hidden md:flex">
                    <li>
                        <Link className={`NavItem ${currentPath === "/" ? "active" : ""}`} to="/">Home</Link>
                    </li>
                    <li>
                        <Link className={`NavItem ${currentPath === "/accommodation" ? "active" : ""}`} to="/accommodation">Accommodation</Link>
                    </li>
                    <li>
                        <Link className={`NavItem ${currentPath === "/transport" ? "active" : ""}`} to="/transport">Transport</Link>
                    </li>
                    <li>
                        <Link className={`NavItem ${currentPath === "/about" ? "active" : ""}`} to="/about">About</Link>
                    </li>
                    <li>
                        <Link className={`NavItem ${currentPath === "/contact" ? "active" : ""}`} to="/contact">Contact</Link>
                    </li>
                </ul>

                {/* Sign Up Link for Desktop */}
                <Link to="/login" className="login-button hidden md:block">
                    Sign up
                </Link>

                {/* Hamburger Icon for Mobile */}
                <button onClick={toggleMenu} className="md:hidden cursor-pointer" aria-label="Toggle menu">
                    ☰
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="custom-mobile-nav md:hidden">
                    <ul className="flex flex-col gap-4">
                        <li>
                            <Link className={`NavItem ${currentPath === "/" ? "active" : ""}`} to="/" onClick={closeMenu}>Home</Link>
                        </li>
                        <li>
                            <Link className={`NavItem ${currentPath === "/accommodation" ? "active" : ""}`} to="/accommodation" onClick={closeMenu}>Accommodation</Link>
                        </li>
                        <li>
                            <Link className={`NavItem ${currentPath === "/transport" ? "active" : ""}`} to="/transport" onClick={closeMenu}>Transport</Link>
                        </li>
                        <li>
                            <Link className={`NavItem ${currentPath === "/about" ? "active" : ""}`} to="/about" onClick={closeMenu}>About</Link>
                        </li>
                        <li>
                            <Link className={`NavItem ${currentPath === "/contact" ? "active" : ""}`} to="/contact" onClick={closeMenu}>Contact</Link>
                        </li>
                    </ul>
                    <Link to="/login" onClick={closeMenu} className="mt-4 block w-full text-center border border-black rounded-full px-6 py-2 shadow-sm hover:bg-gray-100 transition login-button">
                        Sign up
                    </Link>
                </div>
            )}
        </nav>
    );
};