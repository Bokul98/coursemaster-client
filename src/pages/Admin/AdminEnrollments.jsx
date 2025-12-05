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
        const url = batchId ? `https://coursemaster-ruddy.vercel.app/admin/batches/${batchId}/enrollments` : (courseId ? `https://coursemaster-ruddy.vercel.app/admin/courses/${courseId}/enrollments` : `https://coursemaster-ruddy.vercel.app/admin/enrollments`);
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-12 space-y-6">
      {loading && (
        <div className="p-6 bg-white rounded-2xl shadow-md text-gray-600 font-medium">
          Loading enrollments…
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg shadow-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="min-w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Student', 'Contact', 'Progress', 'Batch', 'Enrolled At', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-600"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {enrollments.map((e) => (
                <tr
                  key={e._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{e.user?.name || e.userId}</div>
                    <div className="text-sm text-gray-500">ID: {e.user?._id || e.userId}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {e.user?.email || '—'}
                    <br />
                    {e.user?.phone || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{e.progress ?? 0}%</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{e.batchId || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-center">
                    {new Date(e.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      to={`/admin/users/${e.user?._id || e.userId}/assignments`}
                      className="px-3 py-1 border rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Assignments
                    </Link>
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
