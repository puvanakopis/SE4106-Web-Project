import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import './Navbar.css';
import { AuthContext } from '../../Context/AuthContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const subMenuRef = useRef(null);
    const location = useLocation();
    const currentPath = location.pathname;
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn, validUser } = useContext(AuthContext);

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

    const toggleSubMenu = () => setIsSubMenuOpen(!isSubMenuOpen);
    const closeSubMenu = () => setIsSubMenuOpen(false);

    const logout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        scrollNavigate('/');
    };

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

    return (
        <nav className="Navbar">
            <div className="navbar-container">

                {/* Logo */}
                <div className="logo">
                    <span onClick={() => scrollNavigate('/')} className="logo-text cursor-pointer">CampusEase</span>
                </div>

                {/* Desktop Navigation */}
                <ul className="nav-links">
                    <li><span onClick={() => scrollNavigate('/')} className={`NavItem cursor-pointer ${currentPath === "/" ? "active" : ""}`}>Dashboard</span></li>
                    <li><span onClick={() => scrollNavigate('/room')} className={`NavItem cursor-pointer ${currentPath === "/room" ? "active" : ""}`}>Room</span></li>
                    <li><span onClick={() => scrollNavigate('/transport')} className={`NavItem cursor-pointer ${currentPath === "/transport" ? "active" : ""}`}>Transport</span></li>
                    <li><span onClick={() => scrollNavigate('/owner')} className={`NavItem cursor-pointer ${currentPath === "/owner" ? "active" : ""}`}> Owner</span></li>
                </ul>

                {/* Sign Up and Submenu */}
                <div className="relative" ref={subMenuRef}>
                    {isLoggedIn ? (
                        <>
                            <div onClick={toggleSubMenu} className="login-button hidden cursor-pointer">
                                {validUser?.dp ? (
                                    <img
                                        src={validUser.dp}
                                        alt="Profile"
                                        className="profile-image"
                                    />
                                ) : (
                                    <span>P</span>
                                )}
                            </div>
                            <div className={`sub-menu ${isSubMenuOpen ? 'open' : ''}`}>
                                <span onClick={() => { closeSubMenu(); scrollNavigate('/profile'); }} className={`subItem cursor-pointer ${currentPath === "/profile" ? "active" : ""}`}>Profile</span>
                                <span onClick={() => { closeSubMenu(); logout(); }} className="subItem cursor-pointer">Logout</span>
                            </div>
                        </>
                    ) : (
                        <span onClick={() => scrollNavigate('/login')} className="login-button login hidden cursor-pointer">
                            Login
                        </span>
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

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className={`custom-mobile-nav ${isClosing ? 'closing' : ''}`}>
                    <ul className="flex flex-col gap-4 text">
                        <li><span onClick={() => { closeMenu(); scrollNavigate('/'); }} className={`NavItem cursor-pointer ${currentPath === "/" ? "active" : ""}`}>Home</span></li>
                        <li><span onClick={() => { closeMenu(); scrollNavigate('/room'); }} className={`NavItem cursor-pointer ${currentPath === "/room" ? "active" : ""}`}>Room</span></li>
                        <li><span onClick={() => { closeMenu(); scrollNavigate('/transport'); }} className={`NavItem cursor-pointer ${currentPath === "/transport" ? "active" : ""}`}>Transport</span></li>
                        <li><span onClick={() => { closeMenu(); scrollNavigate('/owner'); }} className={`NavItem cursor-pointer ${currentPath === "/owner" ? "active" : ""}`}>Owner</span></li>
                        {isLoggedIn && (
                            <li><span onClick={() => { closeMenu(); scrollNavigate('/profile'); }} className={`NavItem cursor-pointer ${currentPath === "/profile" ? "active" : ""}`}>Profile</span></li>
                        )}
                    </ul>

                    {isLoggedIn ? (
                        <span onClick={() => { closeMenu(); logout(); }} className="sub-login-button cursor-pointer">
                            Log Out
                        </span>
                    ) : (
                        <span onClick={() => { closeMenu(); scrollNavigate('/login'); }} className="sub-login-button cursor-pointer">
                            Sign up
                        </span>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;