import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "/src/assets/Logo.png";

const API = "http://localhost:5000";

const StudentDashboard = () => {
  const [toast, setToast] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location && location.state && location.state.toast) {
      setToast(location.state.toast);
      // clear state so toast doesn't reappear on refresh
      window.history.replaceState({}, document.title);
      setTimeout(() => setToast(null), 3000);
    }

    const loadEnrollments = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setEnrollments([]);
          setLoading(false);
          return;
        }

        const res = await fetch(`${API}/student/enrollments`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error('Failed to load enrollments');
        const data = await res.json();

        // for each enrollment fetch course metadata from public /courses/:id
        const withCourse = await Promise.all(data.map(async (e) => {
          try {
            const cRes = await fetch(`${API}/courses/${e.courseId}`);
            const course = cRes.ok ? await cRes.json() : null;
            return { ...e, course };
          } catch (err) {
            return { ...e, course: null };
          }
        }));

        setEnrollments(withCourse);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEnrollments();
  }, [location]);

  const totalEnrolled = enrollments.length;
  const avgProgress = totalEnrolled === 0 ? 0 : Math.round(enrollments.reduce((s, e) => s + (e.progress || 0), 0) / totalEnrolled);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">

      {/* ================= NAVBAR STYLE LOGO ================= */}
      <div className="w-full flex justify-center items-center py-4 border-b bg-white shadow-sm rounded-xl">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="h-14 w-auto object-contain" />
        </Link>
      </div>

      {/* HERO */}
      <div className="bg-gradient-to-r from-[#eef2ff] to-[#f0f9ff] rounded-2xl p-8 shadow-sm text-center">
        <h1 className="text-3xl font-extrabold text-[#0D3056]">Welcome back, Student</h1>
        <p className="text-gray-600 mt-2">This is your learning hub — overview of enrolled courses and progress.</p>

        {toast && (
          <div className="fixed right-6 top-6 z-50"><div className="bg-green-600 text-white px-4 py-2 rounded shadow">{toast}</div></div>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/courses" className="px-4 py-2 bg-green-600 text-white rounded-md text-sm">Browse Courses</Link>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">My Courses</button>
          <button className="px-4 py-2 bg-gray-100 border rounded-md text-sm">Support</button>
        </div>

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

      {/* Enrolled courses list */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4">My Courses</h3>
        {loading && <div className="text-sm text-gray-500">Loading…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

        {!loading && enrollments.length === 0 && <div className="text-sm text-gray-500">You are not enrolled in any courses.</div>}

        <ul className="space-y-4">
          {enrollments.map((e) => {
            const c = e.course || { _id: e.courseId, title: 'Untitled course', instructor: '' };
            // compute progress from lessonsCompleted tokens if available, otherwise use stored progress
            const lessons = (c?.metadata?.lessons && Array.isArray(c.metadata.lessons)) ? c.metadata.lessons : (Array.isArray(c?.syllabus) && c.syllabus.length ? c.syllabus : []);
            const totalTasks = Math.max(lessons.length * 3, 3); // fallback minimal
            const tokens = Array.isArray(e.lessonsCompleted) ? [...new Set(e.lessonsCompleted)] : [];
            const computedProgress = Math.round((tokens.length / totalTasks) * 100);
            const progress = isNaN(computedProgress) ? (e.progress || 0) : computedProgress;
            return (
              <li key={e._id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{c.title}</div>
                  <div className="text-xs text-gray-500">{c.instructor}</div>
                  <div className="mt-2 w-48 bg-gray-100 h-2 rounded overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#0D3056] to-[#0A7CB7]" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <Link to={`/student/course/${c._id}/watch`} className="px-3 py-1 bg-[#0D3056] text-white rounded text-sm">Watch</Link>
                    <Link to={`/student/course/${c._id}/assignment`} className="px-3 py-1 border rounded text-sm">Assignment</Link>
                    <Link to={`/student/course/${c._id}/quiz`} className="px-3 py-1 border rounded text-sm">Quiz</Link>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem('accessToken');
                        if (!token) return setToast('Not authenticated');
                        // mark course fully complete: create tokens for all lesson tasks
                        const lessonsCount = Math.max(lessons.length, 1);
                        const newTokens = [];
                        for (let i = 0; i < lessonsCount; i++) {
                          newTokens.push(`l:${i}:v`, `l:${i}:a`, `l:${i}:q`);
                        }
                        const unique = [...new Set(newTokens)];
                        const progressValue = 100;
                        const res = await fetch(`${API}/student/enrollments/${c._id}/progress`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ progress: progressValue, lessonsCompleted: unique }) });
                        if (!res.ok) throw new Error('Failed to update');
                        setToast(`${c.title} marked complete`);
                        // refresh enrollments
                        const r2 = await fetch(`${API}/student/enrollments`, { headers: { Authorization: `Bearer ${token}` } });
                        const data = await r2.json();
                        const withCourse = await Promise.all(data.map(async (ee) => {
                          try { const cRes = await fetch(`${API}/courses/${ee.courseId}`); const course = cRes.ok ? await cRes.json() : null; return { ...ee, course }; } catch { return { ...ee, course: null }; }
                        }));
                        setEnrollments(withCourse);
                      } catch (err) { console.error(err); setToast('Could not mark complete'); }
                      setTimeout(() => setToast(null), 2500);
                    }}
                    className="text-xs text-gray-600 hover:underline"
                  >
                    Mark Completed
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;
