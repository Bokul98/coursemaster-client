import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "https://coursemaster-ruddy.vercel.app/admin";

// 🔹 Reusable fetch helper
const fetchWithAuth = async (endpoint) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API}/${endpoint}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
};

// 🔹 Reusable button
const Btn = ({ to, children, className }) => (
  <Link
    to={to}
    className={`inline-flex items-center px-4 py-2 rounded-md text-sm ${className}`}
  >
    {children}
  </Link>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    courses: 0,
    enrollments: 0,
    assignments: 0,
  });

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      const s = await fetchWithAuth("stats");
      const c = await fetchWithAuth("courses");

      if (s) setStats(s);
      setCourses(Array.isArray(c) ? c.slice(0, 6) : []);
    };

    loadDashboard();
  }, []);

  const statsItems = [
    { label: "Courses",
      value: stats.courses,
      link: "/admin/courses" },
    {
      label: "Enrollments",
      value: stats.enrollments,
      // enrollment pages are course-specific; point to courses list
      link: "/admin/enrollments",
    },
    {
      label: "Assignments",
      value: stats.assignments,
      // assignment review is per-course; point to courses list
      link: "/admin/assignments",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Overview — manage courses, batches, enrollments and assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Btn to="/admin/courses/new" className="bg-green-600 text-white">
            Create Course
          </Btn>
          <Btn to="/admin/courses" className="bg-white border">
            Manage Courses
          </Btn>
          <Btn to="/admin/analytics" className="bg-indigo-600 text-white">
            Analytics
          </Btn>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsItems.map((item) => (
          <Link
            key={item.label}
            to={item.link}
            className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition flex items-center justify-between"
          >
            <div>
              <div className="text-sm text-gray-500">{item.label}</div>
              <div className="text-2xl font-bold text-gray-900">{item.value}</div>
            </div>
            <div className="text-3xl">{item.icon}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions + Recent Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
          <p className="text-sm text-gray-500 mb-4">
            Create courses, define batches and review enrollments or assignment submissions quickly.
          </p>
          <div className="flex flex-wrap gap-3">
            <Btn to="/admin/courses/new" className="bg-green-600 text-white">
              Create Course
            </Btn>
            <Btn to="/admin/courses" className="bg-blue-600 text-white">
              Manage Courses
            </Btn>
            <Btn to="/admin/assignments" className="bg-indigo-600 text-white">
              Review Assignments
            </Btn>
            <Btn to="/admin/enrollments" className="bg-gray-100 border">
              View Enrollments
            </Btn>
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold mb-3">Recent Courses</h3>

          {courses.length === 0 ? (
            <div className="text-sm text-gray-500">No courses yet.</div>
          ) : (
            <ul className="space-y-3">
              {courses.map((course) => (
                <li
                  key={course._id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {course.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {course.instructor || "—"} • ${course.price ?? 0}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Btn
                      to={`/admin/courses/${course._id}/batches`}
                      className="border px-3 py-1"
                    >
                      Batches
                    </Btn>
                    <Btn
                      to={`/admin/courses/${course._id}/enrollments`}
                      className="border px-3 py-1"
                    >
                      Enrollments
                    </Btn>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
