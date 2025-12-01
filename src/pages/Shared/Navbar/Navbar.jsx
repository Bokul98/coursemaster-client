import React, { useState } from "react";
import { Link } from "react-router";

const Navbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <nav className="w-full shadow-md bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                
                {/* Logo Section */}
                <Link to="/">
                    <img src="/src/assets/Logo.png" alt="CourseMaster Logo" className="w-40 cursor-pointer" />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="hover:text-blue-600 font-medium transition-colors">Home</Link>
                    <Link to="/courses" className="hover:text-blue-600 font-medium transition-colors">Courses</Link>
                    <Link to="/login" className="hover:text-blue-600 font-medium transition-colors">Login</Link>
                    <Link to="/register" className="hover:text-blue-600 font-medium transition-colors">Register</Link>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden flex flex-col gap-1 focus:outline-none"
                    onClick={() => setOpen(!open)}
                >
                    {/* Humber Icon */}
                    <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${open ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${open ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${open ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {open && (
                <div className="md:hidden bg-white border-t absolute w-full left-0 shadow-lg">
                    <Link 
                        to="/" 
                        className="block px-6 py-3 hover:bg-gray-100 font-medium"
                        onClick={() => setOpen(false)}
                    >
                        Home
                    </Link>
                    <Link 
                        to="/courses" 
                        className="block px-6 py-3 hover:bg-gray-100 font-medium"
                        onClick={() => setOpen(false)}
                    >
                        Courses
                    </Link>
                    <Link 
                        to="/login" 
                        className="block px-6 py-3 hover:bg-gray-100 font-medium"
                        onClick={() => setOpen(false)}
                    >
                        Login
                    </Link>
                    <Link 
                        to="/register" 
                        className="block px-6 py-3 hover:bg-gray-100 font-medium"
                        onClick={() => setOpen(false)}
                    >
                        Register
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;