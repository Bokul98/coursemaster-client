import React from "react";
import { Outlet } from "react-router";
import { Link } from "react-router";
import LogoPng from '/src/assets/Logo.png';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100">

            {/* Logo */}
            <div className="pb-4">
                <Link to="/">
                <img src={LogoPng} alt="CourseMaster Logo" className="w-40 cursor-pointer" />
            </Link>
            </div>

            {/* Auth Card */}
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
                {children}
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
