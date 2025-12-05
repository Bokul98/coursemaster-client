import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const AdminAssignments = () => {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);
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
        const url = courseId ? `http://localhost:5000/admin/courses/${courseId}/assignments` : `http://localhost:5000/admin/assignments`;
        const res = await fetch(url, { headers: authHeader() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load assignments');
        setAssignments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-12 space-y-6">

      {loading && (
        <div className="p-6 bg-white rounded-2xl shadow-md text-gray-600 font-medium">
          Loading submissions…
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg shadow-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow divide-y divide-gray-100 overflow-hidden">

          {assignments.length === 0 && (
            <div className="p-6 text-gray-500 text-center font-medium">
              No submissions yet.
            </div>
          )}

          {assignments.map(a => (
            <div key={a._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4">
                    <div>
                      <div className="font-semibold text-gray-900">{a.user?.name || a.userId}</div>
                      <div className="text-sm text-gray-500">{a.user?.email || '—'}</div>
                    </div>
                    <div className="text-sm text-gray-500 whitespace-nowrap">
                      Submitted: {new Date(a.submittedAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-gray-700 break-words">
                    {a.content}
                  </div>

                  {a.moduleId && (
                    <div className="mt-2 text-xs text-gray-500">
                      Module: {a.moduleId} {a.lessonId ? `• Lesson: ${a.lessonId}` : ''}
                    </div>
                  )}
                </div>

                <div className="mt-4 md:mt-0 flex-shrink-0 flex flex-col gap-2">
                  <Link
                    to={`/admin/users/${a.user?._id || a.userId}/assignments`}
                    className="px-3 py-1 border rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    View All
                  </Link>
                </div>

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default AdminAssignments;
