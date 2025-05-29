import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, } from "react-icons/fa";
import "./Footer.css"
import { Link } from "react-router-dom";


const Footer = () => {
    return (
        <footer className="footer px-6 py-10">
            <div className="max-w-7xl mx-auto">
                {/* Brand Description */}
                <div className="footer-logo">
                    <h1 className=" font-bold text-gray-900"><Link className="logo-text" to="/">CampusEase</Link></h1>
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
};

export default Footer;