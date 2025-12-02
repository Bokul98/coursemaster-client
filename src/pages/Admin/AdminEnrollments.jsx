import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AdminEnrollments = () => {
  const { courseId } = useParams();
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    fetch(`/admin/courses/${courseId}/enrollments`, { headers: authHeader() })
      .then(r => r.json())
      .then(setEnrollments)
      .catch(() => setEnrollments([]));
  }, [courseId]);

  const authHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-4">Enrollments for Course {courseId}</h1>
      <div className="grid gap-3">
        {enrollments.map(e => (
          <div key={e._id} className="bg-white p-4 rounded shadow flex items-center justify-between">
            <div>
              <div className="font-semibold">User: {e.userId}</div>
              <div className="text-sm text-gray-500">Progress: {e.progress}%</div>
            </div>
            <div className="text-sm text-gray-500">Enrolled: {new Date(e.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEnrollments;
