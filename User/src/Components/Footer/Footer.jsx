import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useInView } from 'react-intersection-observer';
import "./Footer.css";
import { Link } from "react-router-dom";
import { scrollToTop } from '../../Pages/scrollToTop';

const Footer = () => {
    // Modified intersection observer without triggerOnce
    const [footerRef, footerInView] = useInView({
        threshold: 0.1
    });

    return (
        <footer className="footer px-6 py-5" ref={footerRef}>
            <div className={`max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${footerInView ? 'animate-in' : ''}`}>
                
                {/* Logo & Tagline */}
                <div className={`footer-logo ${footerInView ? 'slide-in-left delay-100' : ''}`}>
                    <h1 className="font-bold text-gray-900">
                        <Link className="logo-text" to="/" onClick={scrollToTop}>CampusEase</Link>
                    </h1>
                    <p className="mt-3 text-sm text-gray-600">
                        CampusEase is your smart companion for finding trusted student accommodations and booking campus transport—efficiently and securely.
                    </p>
                </div>

                {/* About Section */}
                <div className={`footer-section about ${footerInView ? 'slide-in-left delay-200' : ''}`}>
                    <h2 className="header">About</h2>
                    <ul className="li-item space-y-1 text-gray-600">
                        <li><Link to="/about" onClick={scrollToTop}>About Us</Link></li>
                        <li><Link to="/contact" onClick={scrollToTop}>Contact Us</Link></li>
                        <li><Link to="/login" onClick={scrollToTop}>Get Started</Link></li>
                    </ul>
                </div>

                {/* Services Section */}
                <div className={`footer-section services ${footerInView ? 'slide-in-left delay-200' : ''}`}>
                    <h2 className="header">Services</h2>
                    <ul className="li-item space-y-1 text-gray-600">
                        <li><Link to="/accommodation" onClick={scrollToTop}>Find Accommodation</Link></li>
                        <li><Link to="/transport" onClick={scrollToTop}>Book Transport</Link></li>
                        <li><Link to="/profile" onClick={scrollToTop}>Manage Account</Link></li>
                        <li><Link to="/saved" onClick={scrollToTop}>Saved Items</Link></li>
                    </ul>
                </div>

                {/* Contact & Social Media */}
                <div className={`footer-section ${footerInView ? 'slide-in-left delay-200' : ''}`}>
                    <h2 className="header">Get in Touch</h2>
                    <div className="li-item space-y-2 text-gray-600 text-sm">
                        <p className="hover:text-gray-800 transition-colors">Phone: +94 71 234 5678</p>
                        <p className="hover:text-gray-800 transition-colors">Email: support@campusease.lk</p>
                        <p className="hover:text-gray-800 transition-colors">Location: University Road, Pambahinna, Belihuloya, Sri Lanka</p>
                    </div>
                    <div className="li-item social-media flex space-x-4 mt-4 text-gray-700">
                        <a href="#" className={`hover:text-blue-600 transition-colors ${footerInView ? 'scale-up delay-500' : ''}`}><FaFacebookF /></a>
                        <a href="#" className={`hover:text-blue-400 transition-colors ${footerInView ? 'scale-up delay-600' : ''}`}><FaTwitter /></a>
                        <a href="#" className={`hover:text-pink-600 transition-colors ${footerInView ? 'scale-up delay-700' : ''}`}><FaInstagram /></a>
                        <a href="#" className={`hover:text-blue-700 transition-colors ${footerInView ? 'scale-up delay-800' : ''}`}><FaLinkedinIn /></a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className={`text-center text-gray-500 mt-10 pt-4 border-t border-gray-300 text-sm ${footerInView ? 'fade-in delay-1000' : ''}`}>
                © {new Date().getFullYear()} CampusEase. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;