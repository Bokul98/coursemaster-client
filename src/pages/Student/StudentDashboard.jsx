import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [enrolled, setEnrolled] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    setEnrolled(data);
  }, []);

  const updateProgress = (id, progress) => {
    const next = enrolled.map(c => c.id === id ? { ...c, progress } : c);
    setEnrolled(next);
    localStorage.setItem('enrolledCourses', JSON.stringify(next));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

      {enrolled.length === 0 ? (
        <div className="bg-white p-6 rounded shadow">You have not enrolled in any courses yet.</div>
      ) : (
        <div className="grid gap-4">
          {enrolled.map(course => (
            <div key={course.id} className="bg-white p-4 rounded shadow flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{course.title}</h2>
                <p className="text-sm text-gray-500">Progress: {course.progress || 0}%</p>
                <div className="w-64 h-3 bg-gray-200 rounded overflow-hidden mt-2">
                  <div className="h-full bg-[#0D3056]" style={{ width: `${course.progress || 0}%` }} />
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <Link to={`/courses/${course.id}/player`} className="px-4 py-2 bg-[#0D3056] text-white rounded">Open Course</Link>
                <button onClick={() => updateProgress(course.id, Math.min(100, (course.progress || 0) + 10))} className="px-3 py-1 border rounded">+10%</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
