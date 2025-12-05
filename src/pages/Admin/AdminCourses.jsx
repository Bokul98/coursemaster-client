import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const authHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://coursemaster-ruddy.vercel.app/admin/courses', { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load courses');
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this course? This action cannot be undone.')) return;
    try {
      setDeleting(id);
      const res = await fetch(`https://coursemaster-ruddy.vercel.app/admin/courses/${id}`, { method: 'DELETE', headers: authHeader() });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Failed to delete');
      setCourses(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert(err.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 space-y-6">

  {loading && (
    <div className="p-6 bg-white rounded-2xl shadow-md text-gray-600 font-medium text-center">
      Loading courses…
    </div>
  )}

  {error && (
    <div className="p-4 bg-red-50 text-red-700 rounded-lg shadow-sm text-center">
      {error}
    </div>
  )}

  {!loading && !error && (
    <div className="bg-white rounded-2xl shadow-md overflow-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Title</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Instructor</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Price</th>
            <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {courses.map(c => (
            <tr key={c._id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4">
                <div className="font-semibold text-gray-900">{c.title}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {c.description ? (c.description.slice(0, 120) + (c.description.length > 120 ? '…' : '')) : ''}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">{c.instructor || '—'}</td>
              <td className="px-6 py-4 text-sm text-gray-700">${c.price ?? 0}</td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap justify-center gap-2">
                  <Link
                    to={`/admin/courses/${c._id}/batches`}
                    className="px-4 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-medium hover:bg-blue-100 transition"
                  >
                    Batches
                  </Link>
                  <Link
                    to={`/admin/courses/${c._id}/enrollments`}
                    className="px-4 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-medium hover:bg-green-100 transition"
                  >
                    Enrollments
                  </Link>
                  <Link
                    to={`/admin/courses/${c._id}/assignments`}
                    className="px-4 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-xs font-medium hover:bg-purple-100 transition"
                  >
                    Assignments
                  </Link>
                  <button
                    onClick={() => navigate(`/admin/courses/${c._id}`)}
                    className="px-4 py-1 bg-yellow-400 text-white rounded-full text-xs font-medium hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    disabled={deleting === c._id}
                    className={`px-3 py-1 ${deleting === c._id ? 'bg-red-300' : 'bg-red-500'} text-white rounded-full text-xs font-medium hover:bg-red-600 transition`}
                  >
                    {deleting === c._id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
  );
};

export default AdminCourses;
