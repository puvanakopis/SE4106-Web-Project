import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, } from "react-icons/fa";
import "./Footer.css"
import { Link } from "react-router-dom";


const Footer = () => {
    return (
        <footer className="footer px-6 py-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Brand Description */}
                <div className="footer-logo">
                    <h1 className=" font-bold text-gray-900"><Link className="logo-text" to="/">CampusEase</Link></h1>
                    <p className="mt-3 text-sm">
                        A smart platform for university students and lecturers to find
                        verified accommodation and book transport easily.
                    </p>
                </div>

                {/* About Us */}
                <div className="footer-section about">
                    <h2 className="header">About</h2>
                    <ul className="space-y-1">
                        <li className="cursor-pointer"><Link to="about">About Us</Link></li>
                        <li className="cursor-pointer"><Link to="contact">Contact Us</Link></li>
                        <li className="cursor-pointer"><Link to="login">Sign up</Link></li>
                    </ul>
                </div>

                {/* Services */}
                <div className="footer-section services">
                    <h2 className="header">Services</h2>
                    <ul className="space-y-1">
                        <li className="cursor-pointer"><Link to="accommodation">Find Accommodation</Link></li>
                        <li className="cursor-pointer"><Link to="transport">Book Transport</Link></li>
                        <li className="cursor-pointer"><Link to="account">Account</Link></li>
                        <li className="cursor-pointer"><Link to="contact">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="footer-section">
                    <h2 className="header">Contact Information</h2>
                    <div className="space-y-2">
                        <p>Phone: 1234567890</p>
                        <p>Email: campusease@email.com</p>
                        <p>Location: University Road, Pambahinna, Belihuloya 70140, Sri Lanka</p>
                    </div>
                    <div className="social-media flex space-x-4 mt-4">
                        <FaFacebookF />
                        <FaTwitter />
                        <FaInstagram />
                        <FaLinkedinIn />
                    </div>
                </div>
            </div>

            {/* Bottom Text */}
            <div className="text-center text-gray-500 mt-10 pt-4 border-t">
                © 2025 | All rights reserved
            </div>
        </footer>
    );
};

export default Footer;