import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '/src/assets/Logo.png';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ courses: 0, enrollments: 0, assignments: 0 });
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch('http://localhost:5000/admin/stats', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!res.ok) return; // ignore
        const data = await res.json();
        setStats(data);
      } catch (e) {
        // ignore errors for now
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/">
            <img src={Logo} alt="Logo" className="w-28 object-contain" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Manage courses, batches, enrollments and review student submissions.</p>
          </div>
        </div>
      </header>

      <main>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/admin/courses" className="block bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Courses</div>
                <div className="mt-3 text-xl font-semibold">Create & Manage</div>
                <p className="mt-2 text-sm text-gray-500">Add, edit or remove courses and their metadata.</p>
              </div>
              <div className="text-3xl font-bold text-[#0D3056]">{stats.courses}</div>
            </div>
            <div className="mt-4">
              <button className="px-3 py-1 bg-[#0D3056] text-white rounded">Open</button>
            </div>
          </Link>

          <Link to="/admin/courses" className="block bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Batches</div>
                <div className="mt-3 text-xl font-semibold">Schedule & Manage</div>
                <p className="mt-2 text-sm text-gray-500">Define course batches, start/end dates and capacity.</p>
              </div>
              <div className="text-3xl font-bold text-[#0D3056]">—</div>
            </div>
            <div className="mt-4">
              <button className="px-3 py-1 bg-[#0D3056] text-white rounded">Open</button>
            </div>
          </Link>

          <Link to="/admin/courses" className="block bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Enrollments</div>
                <div className="mt-3 text-xl font-semibold">View Students</div>
                <p className="mt-2 text-sm text-gray-500">See students enrolled per course or per batch.</p>
              </div>
              <div className="text-3xl font-bold text-[#0D3056]">{stats.enrollments}</div>
            </div>
            <div className="mt-4">
              <button className="px-3 py-1 bg-[#0D3056] text-white rounded">Open</button>
            </div>
          </Link>

          <Link to="/admin/courses" className="block bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Assignments</div>
                <div className="mt-3 text-xl font-semibold">Review Submissions</div>
                <p className="mt-2 text-sm text-gray-500">Review and grade student assignment submissions.</p>
              </div>
              <div className="text-3xl font-bold text-[#0D3056]">{stats.assignments}</div>
            </div>
            <div className="mt-4">
              <button className="px-3 py-1 bg-[#0D3056] text-white rounded">Open</button>
            </div>
          </Link>
        </div>

        <section className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/admin/courses/new" className="inline-block px-4 py-2 bg-green-600 text-white rounded">Create Course</Link>
            <Link to="/admin/courses" className="inline-block px-4 py-2 bg-blue-600 text-white rounded">Manage Courses</Link>
            <Link to="/admin/courses" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded">Manage Batches</Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
