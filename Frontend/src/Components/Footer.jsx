import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import "./Footer.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const Footer = () => {
    const { isAdmin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate("/");
        window.scrollTo(0, 0);
    };

    if (isAdmin) {
        return (
            <footer className="footer px-6 py-10">
                <div className="max-w-7xl mx-auto">
                    {/* Brand Description */}
                    <div className="footer-logo">
                        <h1 className="font-bold text-gray-900">
                            <span onClick={handleLogoClick} className="logo-text cursor-pointer">
                                CampusEase
                            </span>
                        </h1>
                        <p className="mt-3 text-sm">
                            A smart platform for university students and lecturers to find
                            verified accommodation and book transport easily.
                        </p>
                    </div>
                </div>

                {/* Bottom Text */}
                <div className="text-center text-gray-500 mt-10 pt-4 border-t">
                    © 2025 | All rights reserved
                </div>
            </footer>
        );
    }

    return (
        <footer className="footer">
            <div className="footer-container">

                {/* ---------- Brand Description ---------- */}
                <div className="footer-logo">
                    {/* logo */}
                    <h1>
                        <Link className="logo-text" to="/" >CampusEase</Link>
                    </h1>
                    <p className="tagline">
                        CampusEase is your smart companion for finding trusted student accommodations and booking campus transport—efficiently and securely.
                    </p>

                    {/* social media */}
                    <div className="social-media">
                        <FaFacebookF className="social-icon" />
                        <FaTwitter className="social-icon" />
                        <FaInstagram className="social-icon" />
                        <FaLinkedinIn className="social-icon" />
                    </div>
                </div>

                {/* ---------- Section ----------*/}
                <div className="footer-section about">
                    <h2 className="section-header">About</h2>
                    <ul className="section-list">
                        <li><Link to="/about" >About Us</Link></li>
                        <li><Link to="/contact" >Contact Us</Link></li>
                        <li><Link to="/login" >Get Started</Link></li>
                    </ul>
                </div>

                <div className="footer-section services">
                    <h2 className="section-header">Services</h2>
                    <ul className="section-list">
                        <li><Link to="/accommodation" >Find Accommodation</Link></li>
                        <li><Link to="/transport" >Book Transport</Link></li>
                        <li><Link to="/profile" >Manage Account</Link></li>
                        <li><Link to="/saved" >Saved Items</Link></li>
                    </ul>
                </div>

                <div className="footer-section contact">
                    <h2 className="section-header">Get in Touch</h2>
                    <div className="contact-info">
                        <p>Phone: +94 71 234 5678</p>
                        <p>Email: support@campusease.lk</p>
                        <p>Location: University Road, Pambahinna, Belihuloya, Sri Lanka</p>
                    </div>

                </div>
            </div>

            {/* Copyright */}
            <div className="copyright">
                © {new Date().getFullYear()} CampusEase. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;