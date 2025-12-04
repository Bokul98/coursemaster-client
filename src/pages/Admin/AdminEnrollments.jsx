import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const AdminEnrollments = () => {
  const { courseId, batchId } = useParams();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const authHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = batchId ? `http://localhost:5000/admin/batches/${batchId}/enrollments` : `http://localhost:5000/admin/courses/${courseId}/enrollments`;
        const res = await fetch(url, { headers: authHeader() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load enrollments');
        setEnrollments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId, batchId]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {loading && <div className="p-6 bg-white rounded shadow">Loading enrollments…</div>}
      {error && <div className="p-4 bg-red-50 text-red-700 rounded mb-4">{error}</div>}

      {!loading && !error && (
        <div className="bg-white rounded shadow overflow-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Student</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Progress</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Batch</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Enrolled At</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {enrollments.map(e => (
                <tr key={e._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{e.user?.name || e.userId}</div>
                    <div className="text-sm text-gray-500">ID: {e.user?._id || e.userId}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{e.user?.email || '—'}<br/>{e.user?.phone || ''}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{e.progress ?? 0}%</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{e.batchId || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 text-center">{new Date(e.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link to={`/admin/users/${e.user?._id || e.userId}/assignments`} className="px-3 py-1 border rounded text-sm">Assignments</Link>
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

export default AdminEnrollments;
