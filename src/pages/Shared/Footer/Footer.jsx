import React from "react";
import { Link } from "react-router";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                
                {/* 1st Column: Logo & Description */}
                <div>
                    <Link to="/" className="inline-block mb-4">
                        <img 
                            src="/src/assets/Logo-white.png" 
                            alt="CourseMaster Logo" 
                            className="w-40"
                        />
                    </Link>
                    <p className="text-sm leading-relaxed pr-4">
                        Your trusted platform to learn modern skills and build your future. 
                        Join our community to master new technologies.
                    </p>
                </div>

                {/* 2nd Column: Navigation Links */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                        <li><Link to="/courses" className="hover:text-white transition-colors">Courses</Link></li>
                        <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                        <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                    </ul>
                </div>

                {/* 3rd Column: Contact Information */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <span className="font-medium">Email:</span>
                            <span className="text-white">support@coursemaster.com</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-medium">Phone:</span>
                            <span className="text-white">+880 1234 567890</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-medium">Address:</span>
                            <span>Dhaka, Bangladesh</span>
                        </li>
                    </ul>
                </div>

                {/* 4th Column: Social Media Icons (New Added) */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
                    <p className="text-sm mb-4">Stay connected regarding updates.</p>
                    <div className="flex space-x-4">
                        <a 
                            href="https://www.facebook.com/misunacademy" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 hover:text-white transition-all duration-300"
                        >
                            <FaFacebookF size={18} />
                        </a>
                        <a 
                            href="https://twitter.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-sky-500 hover:text-white transition-all duration-300"
                        >
                            <FaTwitter size={18} />
                        </a>
                        <a 
                            href="https://instagram.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-pink-600 hover:text-white transition-all duration-300"
                        >
                            <FaInstagram size={20} />
                        </a>
                        <a 
                            href="https://linkedin.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-700 hover:text-white transition-all duration-300"
                        >
                            <FaLinkedinIn size={18} />
                        </a>
                    </div>
                </div>

            </div>

            {/* Bottom Text */}
            <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-800 pt-6">
                © {new Date().getFullYear()} CourseMaster — All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;