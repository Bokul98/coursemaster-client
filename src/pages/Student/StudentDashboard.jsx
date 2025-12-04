import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "/src/assets/Logo.png";

// Mock Courses (Design Only)
const mockCourses = [
  {
    id: "c1",
    title: "Modern JavaScript from Scratch",
    instructor: "Jane Doe",
    progress: 42,
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "c2",
    title: "React Practical Guide",
    instructor: "John Smith",
    progress: 12,
    video: "https://www.youtube.com/embed/ysz5S6PUM-U",
  },
];

const StudentDashboard = () => {
  const [toast, setToast] = useState(null);
  const location = useLocation();

  const totalEnrolled = mockCourses.length;
  const avgProgress =
    totalEnrolled === 0
      ? 0
      : Math.round(
          mockCourses.reduce((s, c) => s + c.progress, 0) / totalEnrolled
        );

  useEffect(() => {
    if (location && location.state && location.state.toast) {
      setToast(location.state.toast);
      // clear state so toast doesn't reappear on refresh
      window.history.replaceState({}, document.title);
      setTimeout(() => setToast(null), 3000);
    }
  }, [location]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">

      {/* ================= NAVBAR STYLE LOGO ================= */}
      <div className="w-full flex justify-center items-center py-4 border-b bg-white shadow-sm rounded-xl">
        <Link to="/" className="flex items-center">
          <img
            src={Logo}
            alt="Logo"
            className="h-14 w-auto object-contain"
          />
        </Link>
      </div>

      {/* HERO */}
      <div className="bg-gradient-to-r from-[#eef2ff] to-[#f0f9ff] rounded-2xl p-8 shadow-sm text-center">

        <h1 className="text-3xl font-extrabold text-[#0D3056]">
          Welcome back, Student
        </h1>
        <p className="text-gray-600 mt-2">This is your learning hub — overview of enrolled courses and progress.</p>

        {toast && (
          <div className="fixed right-6 top-6 z-50">
            <div className="bg-green-600 text-white px-4 py-2 rounded shadow">{toast}</div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/courses"
            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm"
          >
            Browse Courses
          </Link>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">
            My Courses
          </button>
          <button className="px-4 py-2 bg-gray-100 border rounded-md text-sm">
            Support
          </button>
        </div>

        {/* Small stats row so computed values are used (avoids unused var warnings) */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded shadow text-center">
            <div className="text-xs text-gray-500">Enrolled</div>
            <div className="text-lg font-semibold">{totalEnrolled}</div>
          </div>
          <div className="bg-white p-3 rounded shadow text-center">
            <div className="text-xs text-gray-500">Avg Progress</div>
            <div className="text-lg font-semibold">{avgProgress}%</div>
          </div>
        </div>

      </div>

      {/* Sliding panel removed — student actions now use dedicated pages (Watch / Assignment / Quiz) */}
    </div>
  );
};

export default StudentDashboard;
