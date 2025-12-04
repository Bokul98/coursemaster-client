import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '/src/assets/Logo.png';

// Left-aligned compact header with responsive hamburger and right-side actions.
const AdminHeader = ({ showBack = false, onToggleSidebar }) => {
  const navigate = useNavigate();
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-3">
          <div className="flex items-center gap-3">
            {/* Mobile toggle */}
            <button
              onClick={() => onToggleSidebar && onToggleSidebar(true)}
              aria-label="Open menu"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2z" clipRule="evenodd" />
              </svg>
            </button>

            <Link to="/" className="inline-flex items-center gap-2">
              <img src={Logo} alt="Logo" className="h-8 md:h-10 object-contain" />
            </Link>

            {showBack && (
              <button
                onClick={() => navigate('/admin')}
                aria-label="Back to dashboard"
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-md text-gray-600 hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0L2.586 11l3.707-3.707a1 1 0 011.414 1.414L5.414 11l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700">Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
