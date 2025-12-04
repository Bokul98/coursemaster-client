import React, { useState, useMemo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';
import AdminSidebar from '../components/AdminSidebar';

const nameMap = {
  '': 'Overview',
  admin: 'Admin',
  courses: 'Courses',
  batches: 'Batches',
  enrollments: 'Enrollments',
  assignments: 'Assignments',
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const crumbs = useMemo(() => {
    const parts = location.pathname.replace(/^\//, '').split('/');
    // build crumb items: Admin -> Dashboard (Overview) -> section
    const items = [{ path: '/admin', label: 'Admin' }];
    if (parts[0] === 'admin') {
      // index /admin -> Overview
      if (parts.length === 1 || parts[1] === '') {
        items.push({ path: '/admin', label: 'Dashboard' });
      } else {
        items.push({ path: '/admin', label: 'Dashboard' });
        // show section name
        const section = parts[1];
        const label = nameMap[section] || section;
        items.push({ path: location.pathname, label });
      }
    }
    return items;
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onToggleSidebar={() => setSidebarOpen(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left fixed column */}
          <div className="flex-shrink-0 w-full lg:w-56">
            <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </div>

          {/* Main content */}
          <main className="flex-1 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <nav className="text-sm text-gray-600 flex items-center gap-2">
                {crumbs.map((c, i) => (
                  <span key={c.path} className="inline-flex items-center gap-2">
                    <Link to={c.path} className="hover:underline text-gray-700">{c.label}</Link>
                    {i < crumbs.length - 1 && <span className="text-gray-400">/</span>}
                  </span>
                ))}
              </nav>
            </div>

            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
