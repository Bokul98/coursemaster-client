import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Overview' },
  { to: '/admin/courses', label: 'Courses' },
  { to: '/admin/batches', label: 'Batches' },
  { to: '/admin/enrollments', label: 'Enrollments' },
  { to: '/admin/assignments', label: 'Assignments' },
];

const AdminSidebar = ({ open = false, onClose }) => {
  return (
    <>
      {/* Desktop sidebar: single column, simple list */}
      <aside className="hidden lg:block bg-white rounded-lg shadow p-3 h-[calc(100vh-48px)] sticky top-6">
        <div className="mb-4 px-2">
          <div className="text-xs text-gray-500">Admin</div>
          <div className="mt-1 font-semibold text-lg">Dashboard</div>
        </div>

        <nav>
          <ul className="space-y-1">
            {links.map(l => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end
                  className={({ isActive }) =>
                    `block w-full text-left px-3 py-2 rounded-md text-sm ${isActive ? 'bg-[#0D3056] text-white' : 'text-gray-700 hover:bg-gray-50'}`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile drawer (unchanged) */}
      <div className={`fixed inset-0 z-30 lg:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => onClose && onClose()} />
        <aside className={`absolute left-0 top-0 h-full w-72 bg-white shadow-lg transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Admin</div>
              <div className="mt-1 font-semibold">Dashboard</div>
            </div>
            <button className="p-2 rounded-md text-gray-600 hover:bg-gray-100" onClick={() => onClose && onClose()} aria-label="Close menu">✕</button>
          </div>
          <nav className="p-2">
            <ul className="divide-y">
              {links.map(l => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end
                    onClick={() => onClose && onClose()}
                    className={({ isActive }) =>
                      `block px-4 py-3 text-sm ${isActive ? 'bg-[#0D3056] text-white' : 'text-gray-700 hover:bg-gray-50'}`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
};

export default AdminSidebar;
