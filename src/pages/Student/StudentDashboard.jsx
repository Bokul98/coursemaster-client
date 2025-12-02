import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '/src/assets/Logo.png';

const StudentDashboard = () => {
  const [enrolled, setEnrolled] = useState([]);
  const [userName, setUserName] = useState('Student');

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    setEnrolled(data);
    setUserName(localStorage.getItem('userName') || 'Student');
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#eef2ff] to-[#f0f9ff] rounded-2xl p-8 mb-8 shadow-sm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-white flex items-center justify-center shadow-md mb-4">
            <img src={Logo} alt="Logo" className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain" />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0D3056]">Welcome back, {userName}</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">Keep up the momentum — continue where you left off.</p>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
              <div className="text-sm text-gray-500">Enrolled</div>
              <div className="text-2xl font-bold">{enrolled.length}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
              <div className="text-sm text-gray-500">Avg. Progress</div>
              <div className="text-2xl font-bold">{
                enrolled.length === 0 ? 0 : Math.round(enrolled.reduce((s,c) => s + (c.progress||0), 0) / enrolled.length)
              }%</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
              <div className="text-sm text-gray-500">Active Courses</div>
              <div className="text-2xl font-bold">{enrolled.filter(c => (c.progress||0) < 100).length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Course list */}
      {enrolled.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold mb-2">No enrolled courses yet</h2>
          <p className="text-sm text-gray-500 mb-4">Browse courses and enroll to start learning.</p>
          <Link to="/courses" className="inline-block px-4 py-2 bg-[#0D3056] text-white rounded">Browse Courses</Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enrolled.map(course => (
            <div key={course.id} className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition flex flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{course.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">Instructor: {course.instructor || '—'}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Progress</div>
                  <div className="text-lg font-bold">{course.progress || 0}%</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-100 h-3 rounded overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#0D3056] to-[#0A7CB7]" style={{ width: `${course.progress || 0}%` }} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Link to={`/courses/${course.id}/player`} className="px-3 py-2 bg-[#0D3056] text-white rounded">Continue</Link>
                <Link to={`/courses/${course.id}/player`} className="px-3 py-2 border rounded">Lessons</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
