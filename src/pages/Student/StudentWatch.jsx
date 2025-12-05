import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const API = 'https://coursemaster-ruddy.vercel.app';

const getLessonsFromCourse = (course) => {
  if (!course) return [];
  if (Array.isArray(course?.metadata?.lessons) && course.metadata.lessons.length) {
    return course.metadata.lessons.map((l, i) => ({ id: String(i), title: l.title || l, video: l.video || l.url || l.videoUrl || null }));
  }
  if (Array.isArray(course?.syllabus) && course.syllabus.length) {
    return course.syllabus.map((s, i) => ({ id: String(i), title: typeof s === 'string' ? s : (s.title || `Lesson ${i+1}`), video: s.video || null }));
  }
  return [{ id: '0', title: course?.title || 'Lesson 1', video: course?.video || null }];
};

const Toast = ({ text }) => {
  if (!text) return null;
  return (
    <div className="fixed right-6 top-6 z-50">
      <div className="bg-black/90 text-white px-4 py-2 rounded shadow">{text}</div>
    </div>
  );
};

const StudentWatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(0);
  const [enrollment, setEnrollment] = useState(null);
  const [toast, setToast] = useState(null);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [cRes, eRes] = await Promise.all([
          fetch(`${API}/courses/${id}`),
          (localStorage.getItem('accessToken') ? fetch(`${API}/student/enrollments`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }) : Promise.resolve(null))
        ]);

        if (cRes && cRes.ok) setCourse(await cRes.json());
        if (eRes && eRes.ok) {
          const all = await eRes.json();
          const mine = all.find(x => x.courseId === id || (x.course && x.course._id === id));
          setEnrollment(mine || null);
        }
      } catch (err) {
        console.error(err);
        setToast('Could not load course');
        setTimeout(() => setToast(null), 2000);
      } finally {
        setLoading(false);
      }
    };
    load();
    if (location?.state?.lesson !== undefined) setSelected(Number(location.state.lesson));
  }, [id]);

  const lessons = getLessonsFromCourse(course);

  const videoUrlToEmbed = (u) => {
    if (!u) return '';
    // try to convert youtube watch to embed
    try {
      if (u.includes('youtube.com/watch')) {
        const url = new URL(u);
        const v = url.searchParams.get('v');
        if (v) return `https://www.youtube.com/embed/${v}`;
      }
      if (u.includes('youtu.be/')) {
        const parts = u.split('youtu.be/');
        return `https://www.youtube.com/embed/${parts[1].split('?')[0]}`;
      }
      // if it's a bare id (common for youtube), try to use it
      const bare = String(u).trim();
      // YouTube video ids are typically 11 chars and don't contain spaces
      if (!bare.includes(' ') && bare.length >= 8 && bare.length <= 16) {
        return `https://www.youtube.com/embed/${bare}`;
      }
      // allow embed urls from other providers or direct embed links
      return u;
    } catch { return u; }
  };

  const markLessonVideoComplete = async (lessonIndex) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) { navigate('/login'); return; }
      setMarking(true);
      const tokenKey = `l:${lessonIndex}:v`;
      const existing = Array.isArray(enrollment?.lessonsCompleted) ? enrollment.lessonsCompleted : [];
      if (existing.includes(tokenKey)) {
        setToast('Lesson already marked watched');
        setTimeout(() => setToast(null), 1800);
        setMarking(false);
        return;
      }
      const merged = Array.from(new Set([...existing, tokenKey]));
      const totalTasks = Math.max(lessons.length * 3, 3);
      const progressValue = Math.round((merged.length / totalTasks) * 100);
      const res = await fetch(`${API}/student/enrollments/${id}/progress`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ progress: progressValue, lessonsCompleted: merged }) });
      if (!res.ok) throw new Error('Failed to update progress');

      // refresh enrollment local state
      const r2 = await fetch(`${API}/student/enrollments`, { headers: { Authorization: `Bearer ${token}` } });
      if (r2.ok) {
        const all = await r2.json();
        const mine = all.find(x => x.courseId === id || (x.course && x.course._id === id));
        setEnrollment(mine || null);
      }

      setToast(`Marked watched — progress ${progressValue}%`);
      setTimeout(() => setToast(null), 1200);

      // after marking watched navigate to the Assignment page for same lesson
      navigate(`/student/course/${id}/assignment`, { state: { lesson: String(lessonIndex) } });
    } catch (err) {
      console.error(err);
      setToast('Could not mark watched');
      setTimeout(() => setToast(null), 2000);
    } finally {
      setMarking(false);
    }
  };

  const doneTokens = Array.isArray(enrollment?.lessonsCompleted) ? enrollment.lessonsCompleted : [];
  const currentVideoDone = doneTokens.includes(`l:${selected}:v`);
  const currentAssignDone = doneTokens.includes(`l:${selected}:a`);
  const currentQuizDone = doneTokens.includes(`l:${selected}:q`);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">{loading ? 'Loading…' : `Watch: ${course?.title || id}`}</h2>
        <p className="mb-4 text-sm text-gray-600">Watch the lesson video below. After watching, mark it complete to unlock Assignment and Quiz.</p>

        <div className="mb-4 bg-black rounded overflow-hidden">
          <div className="w-full h-64">
            {lessons[selected]?.video ? (
              <iframe title="video" src={videoUrlToEmbed(lessons[selected].video)} className="w-full h-full" allowFullScreen />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No video available for this lesson</div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => markLessonVideoComplete(selected)}
            disabled={marking || currentVideoDone}
            className={`px-4 py-2 rounded ${currentVideoDone ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white'}`}
          >
            {currentVideoDone ? 'Watched' : (marking ? 'Marking…' : 'Mark Lesson Video Complete')}
          </button>

          <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Back</button>

          <div className="ml-auto text-sm text-gray-600">Status: {currentVideoDone ? 'Video done' : 'Pending'} · Assignment: {currentAssignDone ? 'Done' : 'Locked'} · Quiz: {currentQuizDone ? 'Done' : 'Locked'}</div>
        </div>
      </div>

      <aside className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-3">Lessons</h3>
        <ul className="space-y-2">
          {lessons.map((ls, i) => {
            const videoDone = doneTokens.includes(`l:${i}:v`);
            const assignDone = doneTokens.includes(`l:${i}:a`);
            const quizDone = doneTokens.includes(`l:${i}:q`);
            return (
              <li key={ls.id} onClick={() => setSelected(i)} className={`p-3 rounded cursor-pointer flex items-center justify-between ${i === selected ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
                <div>
                  <div className="text-sm font-medium">{ls.title}</div>
                  <div className="text-xs text-gray-500">{ls.video ? 'Video available' : 'No video'}</div>
                </div>
                <div className="text-xs">
                  <div className="mb-1">{videoDone ? <span className="text-green-600">V</span> : <span className="text-gray-400">•</span>}</div>
                  <div className="mb-1">{assignDone ? <span className="text-yellow-600">A</span> : <span className="text-gray-400">•</span>}</div>
                  <div>{quizDone ? <span className="text-blue-600">Q</span> : <span className="text-gray-400">•</span>}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </aside>

      <Toast text={toast} />
    </div>
  );
};

export default StudentWatch;
