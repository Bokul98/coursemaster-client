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
        const res = await fetch(`http://localhost:5000/admin/courses/${courseId}/assignments`, { headers: authHeader() });
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
    <div className="max-w-6xl mx-auto px-6 py-12">

      {loading && <div className="p-6 bg-white rounded shadow">Loading submissions…</div>}
      {error && <div className="p-4 bg-red-50 text-red-700 rounded mb-4">{error}</div>}

      {!loading && !error && (
        <div className="bg-white rounded shadow divide-y">
          {assignments.length === 0 && <div className="p-6 text-gray-500">No submissions yet.</div>}
          {assignments.map(a => (
            <div key={a._id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{a.user?.name || a.userId}</div>
                      <div className="text-sm text-gray-500">{a.user?.email || ''}</div>
                    </div>
                    <div className="text-sm text-gray-500">Submitted: {new Date(a.submittedAt).toLocaleString()}</div>
                  </div>

                  <div className="mt-3 text-sm text-gray-700">{a.content}</div>
                  {a.moduleId && <div className="mt-2 text-xs text-gray-500">Module: {a.moduleId} {a.lessonId ? `• Lesson: ${a.lessonId}` : ''}</div>}
                </div>

                <div className="ml-4 flex-shrink-0 flex flex-col gap-2">
                  <Link to={`/admin/users/${a.user?._id || a.userId}/assignments`} className="px-3 py-1 border rounded text-sm">View All</Link>
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
