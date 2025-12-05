import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "/src/assets/Logo.png";

const API = "http://localhost:5000";

const tiny = (s, n = 60) => (s ? (s.length > n ? s.slice(0, n - 1) + "…" : s) : "");

const Toast = ({ text }) => {
  if (!text) return null;
  return (
    <div className="fixed right-6 top-6 z-50">
      <div className="bg-black/90 text-white px-4 py-2 rounded shadow">{text}</div>
    </div>
  );
};

const StudentDashboard = () => {
  const [toast, setToast] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location?.state?.toast) {
      setToast(location.state.toast);
      window.history.replaceState({}, document.title);
      setTimeout(() => setToast(null), 3000);
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setEnrollments([]);
          setLoading(false);
          return;
        }
        const res = await fetch(`${API}/student/enrollments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load enrollments");
        const data = await res.json();

        // attach course data
        const withCourse = await Promise.all(
          data.map(async (e) => {
            try {
              const cRes = await fetch(`${API}/courses/${e.courseId}`);
              const course = cRes.ok ? await cRes.json() : null;
              return { ...e, course };
            } catch {
              return { ...e, course: null };
            }
          })
        );

        setEnrollments(withCourse);
      } catch (err) {
        setError(err.message || "Could not load");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [location]);

  const totalEnrolled = enrollments.length;
  const avgProgress =
    totalEnrolled === 0
      ? 0
      : Math.round(enrollments.reduce((s, e) => s + (e.progress || 0), 0) / totalEnrolled);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="w-full flex justify-between items-center py-4 border-b bg-white shadow-sm rounded-xl px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={Logo} alt="Logo" className="h-12 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/courses" className="px-3 py-2 bg-green-600 text-white rounded-md text-sm">Browse</Link>
          <button className="px-3 py-2 bg-gray-100 border rounded-md text-sm">Support</button>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-[#eef2ff] to-[#f0f9ff] rounded-2xl p-6 shadow-sm text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D3056]">Welcome back</h1>
        <p className="text-gray-600 mt-2">Your learning snapshot — progress and active courses.</p>

        <div className="mt-4 mx-auto max-w-md grid grid-cols-2 gap-3">
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

      {/* Courses List */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">My Courses</h3>
          <div className="text-sm text-gray-500">Manage your learning</div>
        </div>

        {loading && <div className="text-sm text-gray-500">Loading…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {!loading && enrollments.length === 0 && (
          <div className="text-sm text-gray-500">You are not enrolled in any courses.</div>
        )}

        <ul className="space-y-4">
          {enrollments.map((e) => {
            const c = e.course || { _id: e.courseId, title: "Untitled course", instructor: "" };
            const lessonsCount =
              (c?.metadata?.lessons && Array.isArray(c.metadata.lessons) && c.metadata.lessons.length) ||
              (Array.isArray(c?.syllabus) && c.syllabus.length) ||
              1;
            const tokens = Array.isArray(e.lessonsCompleted) ? [...new Set(e.lessonsCompleted)] : [];
            const videoDone = tokens.filter((t) => t.endsWith(":v")).length;
            const assignmentDone = tokens.filter((t) => t.endsWith(":a")).length;
            const quizDone = tokens.filter((t) => t.endsWith(":q")).length;
            const progress = e.progress || 0;

            // determine nextAction
            let nextAction = { type: "watch", lesson: 0 };
            for (let i = 0; i < lessonsCount; i++) {
              const hasV = tokens.includes(`l:${i}:v`);
              if (!hasV) { nextAction = { type: "watch", lesson: i }; break; }
              const hasA = tokens.includes(`l:${i}:a`);
              if (!hasA) { nextAction = { type: "assignment", lesson: i }; break; }
              const hasQ = tokens.includes(`l:${i}:q`);
              if (!hasQ) { nextAction = { type: "quiz", lesson: i }; break; }
              nextAction = { type: "done", lesson: i };
            }

            const canWatch = true;
            const canAssignment = nextAction.type === "assignment";
            const canQuiz = nextAction.type === "quiz";
            const isComplete = progress === 100;

            return (
              <li key={e._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0D3056] to-[#0A7CB7] rounded-md flex items-center justify-center text-white font-bold">{(c.title || "C").slice(0,1)}</div>
                  <div>
                    <div className="font-medium text-gray-900">{c.title}</div>
                    <div className="text-xs text-gray-500">{tiny(c.description || c.instructor || "Sed maiores amet in", 90)}</div>

                    <div className="mt-3 w-64 bg-gray-100 h-2 rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#0D3056] to-[#0A7CB7]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{progress}% · Watch {videoDone}/{lessonsCount} · Assign {assignmentDone}/{lessonsCount} · Quiz {quizDone}/{lessonsCount}</div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <Link to={`/student/course/${c._id}/watch`} state={{ lesson: nextAction.lesson }} className={`px-3 py-1 rounded text-sm ${!canWatch ? 'opacity-50 pointer-events-none bg-gray-100' : 'bg-[#0D3056] text-white'}`}>Watch</Link>
                    <Link to={`/student/course/${c._id}/assignment`} state={{ lesson: nextAction.lesson }} className={`px-3 py-1 rounded text-sm border ${!canAssignment ? 'opacity-50 pointer-events-none bg-gray-50' : ''}`}>Assignment</Link>
                    <Link to={`/student/course/${c._id}/quiz`} state={{ lesson: nextAction.lesson }} className={`px-3 py-1 rounded text-sm border ${!canQuiz ? 'opacity-50 pointer-events-none bg-gray-50' : ''}`}>Quiz</Link>
                  </div>

                  {/* Completed / In Progress */}
                  <div className="text-xs font-medium">
                    {progress === 100 ? (
                      <span className="text-green-600">Completed</span>
                    ) : (
                      <span className="text-gray-400">In Progress</span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <Toast text={toast} />
    </div>
  );
};

export default StudentDashboard;
