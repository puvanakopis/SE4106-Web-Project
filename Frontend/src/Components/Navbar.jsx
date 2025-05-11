import React from 'react'
import './Navbar.css'
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {

    // Get the current URL path
    const location = useLocation()
    const currentPath = location.pathname

    return (
        <div className='Navbar'>

            {/* --------------- Logo section --------------- */}
            <div className="logo">
                <Link to={'/'} className='logo-text'>CampusEase</Link>
            </div>


            {/* --------------- Navigation links list --------------- */}
            <div className="NavList">
                <ul>
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
            </div>


            {/* --------------- Sign up --------------- */}
            <div className="login">
                <Link to={'/login'} className="login-button">Sign up</Link>
            </div>

        </div>
    )
}

export default Navbar