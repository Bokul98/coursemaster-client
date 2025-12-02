import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/admin/courses', { headers: authHeader() })
      .then(r => r.json())
      .then(setCourses)
      .catch(() => setCourses([]));
  }, []);

  const authHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this course?')) return;
    await fetch(`/admin/courses/${id}`, { method: 'DELETE', headers: { ...authHeader() } });
    setCourses(courses.filter(c => c._id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/admin/courses/new')} className="px-4 py-2 bg-[#0D3056] text-white rounded">Create Course</button>
        </div>
      </div>

      <div className="grid gap-4">
        {courses.map(c => (
          <div key={c._id} className="bg-white p-4 rounded shadow flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-sm text-gray-500">{c.instructor} — ${c.price}</p>
            </div>

            <div className="flex gap-2">
              <Link to={`/admin/courses/${c._id}/batches`} className="px-3 py-1 border rounded">Batches</Link>
              <Link to={`/admin/courses/${c._id}/enrollments`} className="px-3 py-1 border rounded">Enrollments</Link>
              <Link to={`/admin/courses/${c._id}/assignments`} className="px-3 py-1 border rounded">Assignments</Link>
              <button onClick={() => navigate(`/admin/courses/${c._id}`)} className="px-3 py-1 bg-yellow-400 rounded">Edit</button>
              <button onClick={() => handleDelete(c._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCourses;
