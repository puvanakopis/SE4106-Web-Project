import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import "./Footer.css";
import { Link } from "react-router-dom";
import { scrollToTop } from '../../Pages/scrollToTop';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                
                {/* Logo & Tagline */}
                <div className="footer-logo">
                    <h1>
                        <Link className="logo-text" to="/" onClick={scrollToTop}>CampusEase</Link>
                    </h1>
                    <p className="tagline">
                        CampusEase is your smart companion for finding trusted student accommodations and booking campus transport—efficiently and securely.
                    </p>
                    <div className="social-media">
                        <FaFacebookF className="social-icon" />
                        <FaTwitter className="social-icon" />
                        <FaInstagram className="social-icon" />
                        <FaLinkedinIn className="social-icon" />
                    </div>
                </div>

                {/* About Section */}
                <div className="footer-section about">
                    <h2 className="section-header">About</h2>
                    <ul className="section-list">
                        <li><Link to="/about" onClick={scrollToTop}>About Us</Link></li>
                        <li><Link to="/contact" onClick={scrollToTop}>Contact Us</Link></li>
                        <li><Link to="/login" onClick={scrollToTop}>Get Started</Link></li>
                    </ul>
                </div>

                {/* Services Section */}
                <div className="footer-section services">
                    <h2 className="section-header">Services</h2>
                    <ul className="section-list">
                        <li><Link to="/accommodation" onClick={scrollToTop}>Find Accommodation</Link></li>
                        <li><Link to="/transport" onClick={scrollToTop}>Book Transport</Link></li>
                        <li><Link to="/profile" onClick={scrollToTop}>Manage Account</Link></li>
                        <li><Link to="/saved" onClick={scrollToTop}>Saved Items</Link></li>
                    </ul>
                </div>

                {/* Contact & Social Media */}
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