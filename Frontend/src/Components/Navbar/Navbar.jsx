import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import './Navbar.css';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';

const Navbar = () => {
    // Toggles the mobile menu visibility
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);



    // Get the current URL path
    const location = useLocation();
    const currentPath = location.pathname;



    // Toggles the submenu visibility
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
     const closeSubMenu = () => setIsSubMenuOpen(false);

    const subMenuRef = useRef(null);

    const toggleSubMenu = () => setIsSubMenuOpen(!isSubMenuOpen);

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


    //Usecontext to check if the user is logged in
    const { isLoggedIn } = useContext(AuthContext);




    return (
        <nav className="Navbar">
            <div className="navbar-container">

                {/* Logo */}
                <div className="logo">
                    <Link to="/" className="logo-text">CampusEase</Link>
                </div>

                {/* --------------- Desktop Navigation --------------- */}
                <ul className="nav-links">
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

                {/* Sign Up and Submenu */}
                <div className="relative">
                    {isLoggedIn ?
                        <><Link onClick={toggleSubMenu} className="login-button hidden">
                            P
                        </Link>

                            <div ref={subMenuRef} className={`sub-menu ${isSubMenuOpen ? 'open' : ''}`}>
                                <Link className={`subItem ${currentPath === "/profile" ? "active" : ""}`} to="/profile" onClick={closeSubMenu}>Profile</Link>
                                <Link className={`subItem ${currentPath === "/saved" ? "active" : ""}`} to="/saved" onClick={closeSubMenu}>Saved</Link>
                                <Link className='subItem' to="/" onClick={closeSubMenu}>Logout</Link>
                            </div>
                        </>
                        : <Link to="/login" className="login-button hidden">
                            Login
                        </Link>
                    }

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




            {/* --------------- Mobile Navigation --------------- */}
            {
                isMenuOpen && (
                    <div className="custom-mobile-nav">
                        <ul className="flex flex-col gap-4 text">
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
                            <li>
                                <Link className={`NavItem ${currentPath === "/profile" ? "active" : ""}`} to="/profile" onClick={closeMenu}>Profile</Link>
                            </li>
                            <li>
                                <Link className={`NavItem ${currentPath === "/saved" ? "active" : ""}`} to="/saved" onClick={closeMenu}>Saved</Link>
                            </li>
                        </ul>


                        {isLoggedIn ?
                          <Link onClick={closeMenu}  to="/" className="sub-login-button">
                                Log Out
                            </Link>
                            : <Link onClick={closeMenu} to="/login" className="sub-login-button">
                                Sign up
                            </Link>
                        }
                    </div>
                )
            }
        </nav >
    );
};

export default Navbar;
