import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link, useLocation } from "react-router-dom";
import './Navbar.css';
import { AuthContext } from '../../Context/AuthContext';

const Navbar = () => {
    // Mobile menu open and closing states for animation
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

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

    // Current path for active links
    const location = useLocation();
    const currentPath = location.pathname;

    // Submenu toggle & close
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const subMenuRef = useRef(null);

    const toggleSubMenu = () => setIsSubMenuOpen(!isSubMenuOpen);
    const closeSubMenu = () => setIsSubMenuOpen(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (subMenuRef.current && !subMenuRef.current.contains(event.target)) {
                setIsSubMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Auth context
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

    const logout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
    };

    return (
        <nav className="Navbar">
            <div className="navbar-container">

                {/* Logo */}
                <div className="logo">
                    <Link to="/" className="logo-text">CampusEase</Link>
                </div>

                {/* Desktop Navigation */}
                <ul className="nav-links">
                    <li><Link className={`NavItem ${currentPath === "/" ? "active" : ""}`} to="/">Dashboard</Link></li>
                    <li><Link className={`NavItem ${currentPath === "/addroom" ? "active" : ""}`} to="/addroom">Add Room</Link></li>
                    <li><Link className={`NavItem ${currentPath === "/listroom" ? "active" : ""}`} to="/listroom">List Room</Link></li>
                    <li><Link className={`NavItem ${currentPath === "/addtransport" ? "active" : ""}`} to="/addtransport">Add Transport</Link></li>
                    <li><Link className={`NavItem ${currentPath === "/listtransport" ? "active" : ""}`} to="/listtransport">List Transport</Link></li>
                </ul>

                {/* Sign Up and Submenu */}
                <div className="relative">
                    {isLoggedIn ? (
                        <>
                            <Link onClick={toggleSubMenu} className="login-button hidden">
                                P
                            </Link>
                            <div ref={subMenuRef} className={`sub-menu ${isSubMenuOpen ? 'open' : ''}`}>
                                <Link className={`subItem ${currentPath === "/profile" ? "active" : ""}`} to="/profile" onClick={closeSubMenu}>Profile</Link>
                                <Link className='subItem' to="/" onClick={() => { closeSubMenu(); logout(); }}>Logout</Link>
                            </div>
                        </>
                    ) : (
                        <Link to="/login" className="login-button hidden">
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={toggleMenu}
                    className="mobile-hamburger"
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen ? "true" : "false"}
                >
                    ☰
                </button>
            </div>

            {/* Mobile Navigation with animation */}
            {isMenuOpen && (
                <div className={`custom-mobile-nav ${isClosing ? 'closing' : ''}`}>
                    <ul className="flex flex-col gap-4 text">
                        <li><Link className={`NavItem ${currentPath === "/" ? "active" : ""}`} to="/" onClick={closeMenu}>Home</Link></li>
                        <li><Link className={`NavItem ${currentPath === "/addroom" ? "active" : ""}`} to="/addroom" onClick={closeMenu}>Add Room</Link></li>
                        <li><Link className={`NavItem ${currentPath === "/listroom" ? "active" : ""}`} to="/listroom" onClick={closeMenu}>List Room</Link></li>
                        <li><Link className={`NavItem ${currentPath === "/addtransport" ? "active" : ""}`} to="/addtransport" onClick={closeMenu}>Add Transport</Link></li>
                        <li><Link className={`NavItem ${currentPath === "/listtransport" ? "active" : ""}`} to="/listtransport" onClick={closeMenu}>List Transport</Link></li>
                        <li><Link className={`NavItem ${currentPath === "/profile" ? "active" : ""}`} to="/profile" onClick={closeMenu}>Profile</Link></li>
                    </ul>

                    {isLoggedIn ? (
                        <Link onClick={() => { closeMenu(); logout(); }} to="/" className="sub-login-button">
                            Log Out
                        </Link>
                    ) : (
                        <Link onClick={closeMenu} to="/login" className="sub-login-button">
                            Sign up
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
