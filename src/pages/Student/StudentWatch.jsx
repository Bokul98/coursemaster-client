import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API = 'http://localhost:5000';

const getLessonsFromCourse = (course) => {
  if (!course) return [];
  if (Array.isArray(course?.metadata?.lessons) && course.metadata.lessons.length) {
    return course.metadata.lessons.map((l, i) => ({ id: String(i), title: l.title || l, video: l.video || l.url || l.videoUrl || null }));
  }
  if (Array.isArray(course?.syllabus) && course.syllabus.length) {
    return course.syllabus.map((s, i) => ({ id: String(i), title: typeof s === 'string' ? s : (s.title || `Lesson ${i+1}`), video: s.video || null }));
  }
  // fallback single lesson
  return [{ id: '0', title: course?.title || 'Lesson 1', video: course?.video || null }];
};

const StudentWatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(0);
  const [enrollment, setEnrollment] = useState(null);

  useEffect(() => {
    const load = async () => {
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
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const lessons = getLessonsFromCourse(course);

  const markLessonVideoComplete = async (lessonIndex) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return navigate('/login');
      const tokenKey = `l:${lessonIndex}:v`;
      const existing = Array.isArray(enrollment?.lessonsCompleted) ? enrollment.lessonsCompleted : [];
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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Watch: {loading ? id : (course?.title || id)}</h2>
        <div className="mb-4 text-sm text-gray-600">Select a lesson and watch the video. Mark lesson video complete when done.</div>

        <div className="mb-4 bg-black rounded overflow-hidden">
          <iframe title="video" src={lessons[selected]?.video || 'about:blank'} className="w-full h-64" />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => markLessonVideoComplete(selected)} className="px-4 py-2 bg-green-600 text-white rounded">Mark Lesson Video Complete</button>
          <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Back</button>
        </div>
      </div>

      <aside className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-3">Lessons</h3>
        <ul className="space-y-2">
          {lessons.map((ls, i) => {
            const doneTokens = Array.isArray(enrollment?.lessonsCompleted) ? enrollment.lessonsCompleted : [];
            const videoDone = doneTokens.includes(`l:${i}:v`);
            return (
              <li key={ls.id} className={`p-2 rounded cursor-pointer flex items-center justify-between ${i === selected ? 'bg-gray-50' : ''}`} onClick={() => setSelected(i)}>
                <div>
                  <div className="text-sm font-medium">{ls.title}</div>
                  <div className="text-xs text-gray-500">{ls.video ? 'Video available' : 'No video'}</div>
                </div>
                <div className="text-xs text-green-600">{videoDone ? 'Done' : ''}</div>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
};

export default StudentWatch;
