import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  const [activePanel, setActivePanel] = useState(null);

  const totalEnrolled = mockCourses.length;
  const avgProgress =
    totalEnrolled === 0
      ? 0
      : Math.round(
          mockCourses.reduce((s, c) => s + c.progress, 0) / totalEnrolled
        );

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
        <p className="text-gray-600 mt-2">
          This is your learning hub — overview of enrolled courses and progress.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Enrolled</div>
              <div className="text-2xl font-bold">{totalEnrolled}</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Avg. Progress</div>
              <div className="text-2xl font-bold">{avgProgress}%</div>
            </div>
            <div className="text-3xl">📈</div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Active</div>
              <div className="text-2xl font-bold">
                {mockCourses.filter((c) => c.progress < 100).length}
              </div>
            </div>
            <div className="text-3xl">⚡</div>
          </div>
        </div>
      </div>

      {/* Recent + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Courses */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Courses</h3>
          <ul className="space-y-4">
            {mockCourses.map((c) => (
              <li key={c.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{c.title}</div>
                  <div className="text-xs text-gray-500">{c.instructor}</div>

                  <div className="mt-2 w-48 bg-gray-100 h-2 rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0D3056] to-[#0A7CB7]"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActivePanel({ type: "watch", course: c })}
                      className="px-3 py-1 bg-[#0D3056] text-white rounded text-sm"
                    >
                      Watch
                    </button>
                    <button
                      onClick={() =>
                        setActivePanel({ type: "assignment", course: c })
                      }
                      className="px-3 py-1 border rounded text-sm"
                    >
                      Assignment
                    </button>
                    <button
                      onClick={() => setActivePanel({ type: "quiz", course: c })}
                      className="px-3 py-1 border rounded text-sm"
                    >
                      Quiz
                    </button>
                  </div>

                  <button className="text-xs text-gray-600">
                    Mark Completed
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <p className="text-sm text-gray-500 mb-4">
            Jump to lessons, submit assignments or take quick quizzes.
          </p>

          <div className="flex flex-wrap gap-3">
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
        </div>
      </div>

      {/* Sliding Panel */}
      {activePanel && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1" onClick={() => setActivePanel(null)} />
          <div className="w-full sm:w-96 bg-white shadow-xl p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">
                {activePanel.course.title}
              </h4>
              <button
                onClick={() => setActivePanel(null)}
                className="text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Watch Panel */}
            {activePanel.type === "watch" && (
              <div>
                <div className="aspect-w-16 aspect-h-9 mb-4 bg-black">
                  <iframe
                    title="video"
                    src={activePanel.course.video}
                    className="w-full h-56"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
                <p className="text-sm text-gray-600">
                  This is a preview of the lesson video (design-only).
                </p>
              </div>
            )}

            {/* Assignment Panel */}
            {activePanel.type === "assignment" && (
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Submit an assignment link or text answer (design-only).
                </p>

                <label className="block text-xs text-gray-500 mb-1">
                  Google Drive link
                </label>
                <input
                  className="w-full border rounded px-3 py-2 mb-3"
                  placeholder="https://drive.google.com/..."
                />

                <label className="block text-xs text-gray-500 mb-1">
                  Or write a short answer
                </label>
                <textarea
                  className="w-full border rounded px-3 py-2 mb-3"
                  rows={4}
                  placeholder="Your answer..."
                />

                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-gray-100 border rounded">
                    Submit (design)
                  </button>
                </div>
              </div>
            )}

            {/* Quiz Panel */}
            {activePanel.type === "quiz" && (
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Sample multiple-choice question (design only).
                </p>

                <div className="space-y-3">
                  <div className="p-3 border rounded">A) Option one</div>
                  <div className="p-3 border rounded">B) Option two</div>
                  <div className="p-3 border rounded">C) Option three</div>
                  <div className="p-3 border rounded">D) Option four</div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button className="px-4 py-2 bg-gray-100 border rounded">
                    Submit (design)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
