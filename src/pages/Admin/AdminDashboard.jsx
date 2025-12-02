import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/courses" className="block bg-white rounded shadow p-6 hover:shadow-lg">
          <h2 className="font-semibold text-xl mb-2">Courses</h2>
          <p className="text-sm text-gray-500">Create, edit and delete courses</p>
        </Link>

        <Link to="/admin/courses" className="block bg-white rounded shadow p-6 hover:shadow-lg">
          <h2 className="font-semibold text-xl mb-2">Batches</h2>
          <p className="text-sm text-gray-500">Manage batches for courses</p>
        </Link>

        <Link to="/admin/courses" className="block bg-white rounded shadow p-6 hover:shadow-lg">
          <h2 className="font-semibold text-xl mb-2">Enrollments & Assignments</h2>
          <p className="text-sm text-gray-500">View enrolled students and submitted assignments</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
