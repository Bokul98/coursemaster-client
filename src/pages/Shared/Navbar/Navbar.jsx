import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import isAuthenticated from '../../../utils/auth';
import LogoPng from '/src/assets/Logo.png';

const Navbar = () => {
    const [open, setOpen] = useState(false);

    const [role, setRole] = useState(null);
    const [auth, setAuth] = useState(isAuthenticated());
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    const refreshAuth = () => {
        setAuth(isAuthenticated());
        setRole(localStorage.getItem('userRole'));
        setUserName(localStorage.getItem('userName') || '');
    };

    useEffect(() => {
        refreshAuth();
        // listen for auth changes (login/logout)
        const onAuthChange = () => refreshAuth();
        window.addEventListener('authChange', onAuthChange);
        window.addEventListener('storage', onAuthChange);
        return () => {
            window.removeEventListener('authChange', onAuthChange);
            window.removeEventListener('storage', onAuthChange);
        };
    }, []);

    return (
        <nav className="w-full shadow-md bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-3">
                    <img src={LogoPng} alt="CourseMaster Logo" className="w-40 cursor-pointer" />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="hover:text-blue-600 font-medium transition-colors">Home</Link>
                    <Link to="/courses" className="hover:text-blue-600 font-medium transition-colors">Courses</Link>
                    {!auth && (
                        <>
                            <Link to="/login" className="hover:text-blue-600 font-medium transition-colors">Login</Link>
                            <Link to="/register" className="hover:text-blue-600 font-medium transition-colors">Register</Link>
                        </>
                    )}

                    {auth && (
                        <>
                            <Link to="/student" className="hover:text-blue-600 font-medium transition-colors">Dashboard</Link>
                            <button onClick={() => {
                                localStorage.removeItem('accessToken');
                                localStorage.removeItem('userRole');
                                localStorage.removeItem('userName');
                                window.dispatchEvent(new Event('authChange'));
                                navigate('/');
                            }} className="hover:text-blue-600 font-medium transition-colors">Logout</button>
                        </>
                    )}

                    {role === 'admin' && (
                        <Link to="/admin" className="hover:text-blue-600 font-medium transition-colors">Admin</Link>
                    )}
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

                    {!auth && (
                        <>
                            <Link to="/login" className="block px-6 py-3 hover:bg-gray-100 font-medium" onClick={() => setOpen(false)}>Login</Link>
                            <Link to="/register" className="block px-6 py-3 hover:bg-gray-100 font-medium" onClick={() => setOpen(false)}>Register</Link>
                        </>
                    )}

                    {auth && (
                        <>
                            <Link to="/student" className="block px-6 py-3 hover:bg-gray-100 font-medium" onClick={() => setOpen(false)}>Dashboard</Link>
                            <button onClick={() => { setOpen(false); localStorage.removeItem('accessToken'); localStorage.removeItem('userRole'); localStorage.removeItem('userName'); window.dispatchEvent(new Event('authChange')); navigate('/'); }} className="w-full text-left px-6 py-3 hover:bg-gray-100 font-medium">Logout</button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;