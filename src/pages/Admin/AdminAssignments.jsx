import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AdminAssignments = () => {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetch(`/admin/courses/${courseId}/assignments`, { headers: authHeader() })
      .then(r => r.json())
      .then(setAssignments)
      .catch(() => setAssignments([]));
  }, [courseId]);

  const authHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-4">Assignments for Course {courseId}</h1>
      <div className="grid gap-3">
        {assignments.map(a => (
          <div key={a._id} className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Student: {a.userId}</div>
                <div className="text-sm text-gray-500">Submitted: {new Date(a.submittedAt).toLocaleString()}</div>
                <div className="mt-2 text-sm">{a.content}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAssignments;
