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
      const res = await fetch('http://localhost:5000/admin/courses', { headers: authHeader() });
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
      const res = await fetch(`http://localhost:5000/admin/courses/${id}`, { method: 'DELETE', headers: authHeader() });
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
    <div className="max-w-7xl mx-auto px-6 py-12">

      {loading && <div className="p-6 bg-white rounded shadow">Loading courses…</div>}
      {error && <div className="p-4 bg-red-50 text-red-700 rounded mb-4">{error}</div>}

      {!loading && !error && (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Instructor</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {courses.map(c => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{c.title}</div>
                    <div className="text-sm text-gray-500 mt-1">{c.description ? (c.description.slice(0, 120) + (c.description.length > 120 ? '…' : '')) : ''}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c.instructor || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">${c.price ?? 0}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link to={`/admin/courses/${c._id}/batches`} className="px-3 py-1 border rounded text-sm">Batches</Link>
                      <Link to={`/admin/courses/${c._id}/enrollments`} className="px-3 py-1 border rounded text-sm">Enrollments</Link>
                      <Link to={`/admin/courses/${c._id}/assignments`} className="px-3 py-1 border rounded text-sm">Assignments</Link>
                      <button onClick={() => navigate(`/admin/courses/${c._id}`)} className="px-3 py-1 bg-yellow-400 rounded text-sm">Edit</button>
                      <button onClick={() => handleDelete(c._id)} disabled={deleting === c._id} className="px-3 py-1 bg-red-500 text-white rounded text-sm">
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
