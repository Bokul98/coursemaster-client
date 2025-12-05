import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const API = 'https://coursemaster-ruddy.vercel.app';

const getLessonsFromCourse = (course) => {
  if (!course) return [];
  if (Array.isArray(course?.metadata?.lessons) && course.metadata.lessons.length) {
    return course.metadata.lessons.map((l, i) => ({ id: String(i), title: l.title || l }));
  }
  if (Array.isArray(course?.syllabus) && course.syllabus.length) {
    return course.syllabus.map((s, i) => ({ id: String(i), title: typeof s === 'string' ? s : (s.title || `Lesson ${i+1}`) }));
  }
  return [{ id: '0', title: course?.title || 'Lesson 1' }];
};

const Toast = ({ text }) => {
  if (!text) return null;
  return (
    <div className="fixed right-6 top-6 z-50">
      <div className="bg-black/90 text-white px-4 py-2 rounded shadow">{text}</div>
    </div>
  );
};

const StudentAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [answer, setAnswer] = useState('');
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState('0');
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [cRes, eRes] = await Promise.all([
          fetch(`${API}/courses/${id}`),
          (localStorage.getItem('accessToken') ? fetch(`${API}/student/enrollments`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }) : Promise.resolve(null))
        ]);
        let courseData = null;
        if (cRes && cRes.ok) {
          courseData = await cRes.json();
          setCourse(courseData);
          // auto-select the first lesson when course lessons are available
          const fetchedLessons = getLessonsFromCourse(courseData);
          if ((location?.state?.lesson === undefined) && fetchedLessons.length) {
            setSelectedLesson(String(fetchedLessons[0].id));
          }
        }
        if (eRes && eRes.ok) {
          const all = await eRes.json();
          const mine = all.find(x => x.courseId === id || (x.course && x.course._id === id));
          setEnrollment(mine || null);
        }
      } catch (err) { console.error(err); setToast('Could not load'); setTimeout(() => setToast(null), 1500); }
      finally { setLoading(false); }
    };
    load();
    if (location?.state?.lesson !== undefined) setSelectedLesson(String(location.state.lesson));
  }, [id]);

  const lessons = getLessonsFromCourse(course);

  const canSubmit = () => {
    // require video completion for selected lesson
    const existing = Array.isArray(enrollment?.lessonsCompleted) ? enrollment.lessonsCompleted : [];
    if (!existing.includes(`l:${selectedLesson}:v`)) return { allowed: false, reason: 'Watch the lesson video first' };
    // require either an answer text or a Drive link (very simple URL check)
    const trimmed = (answer || '').trim();
    const looksLikeDrive = trimmed.includes('drive.google.com') || trimmed.startsWith('http');
    if (!trimmed) return { allowed: false, reason: 'Please provide an answer or Drive link' };
    return { allowed: true };
  };

  const handleComplete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return navigate('/login');
      const check = canSubmit();
      if (!check.allowed) { setToast(check.reason); setTimeout(() => setToast(null), 1800); return; }

      setSubmitting(true);
      const payload = { courseId: id, content: answer, moduleId: null, lessonId: selectedLesson };
      const res = await fetch(`${API}/student/assignments`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Submit failed');

      // mark assignment token
      const tokenKey = `l:${selectedLesson}:a`;
      const existingTokens = Array.isArray(enrollment?.lessonsCompleted) ? enrollment.lessonsCompleted : [];
      const merged = Array.from(new Set([...existingTokens, tokenKey]));
      const totalTasks = Math.max(lessons.length * 3, 3);
      const progressValue = Math.round((merged.length / totalTasks) * 100);
      await fetch(`${API}/student/enrollments/${id}/progress`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ progress: progressValue, lessonsCompleted: merged }) });

      setToast('Assignment submitted');
      setTimeout(() => setToast(null), 1800);
      // navigate to quiz for same lesson
      navigate(`/student/course/${id}/quiz`, { state: { lesson: selectedLesson } });
    } catch (err) {
      console.error(err);
      setToast('Could not submit assignment');
      setTimeout(() => setToast(null), 1800);
    } finally { setSubmitting(false); }
  };

  const existing = Array.isArray(enrollment?.lessonsCompleted) ? enrollment.lessonsCompleted : [];
  const videoDone = existing.includes(`l:${selectedLesson}:v`);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-2">{course?.title || course?.name || course?._id || `Course ${id}`}</h2>
        <p className="text-sm text-gray-600 mb-4">Submit your answer or share a Drive link. You must watch the lesson first.</p>

        <label className="block text-sm text-gray-500 mb-1">Syllabus</label>
        <div className="w-full border rounded px-3 py-2 mb-3 bg-gray-50 text-gray-800">{(lessons.find(ls => ls.id === selectedLesson) || {}).title || `Lesson ${selectedLesson}`}</div>

        <div className="mb-3 text-xs">
          <span className={`inline-block px-2 py-1 rounded ${videoDone ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-800'}`}>{videoDone ? 'Video completed' : 'Video not completed'}</span>
        </div>

        <label className="block text-sm text-gray-500 mb-1">Answer or Google Drive link</label>
        <textarea value={answer} onChange={e => setAnswer(e.target.value)} className="w-full border rounded px-3 py-2 mb-3" rows={6} placeholder="Write your answer or paste a Google Drive link here" />

        <div className="flex items-center gap-3">
          <button
            onClick={handleComplete}
            disabled={submitting || !videoDone}
            className={`px-4 py-2 rounded ${(!videoDone || submitting) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white'}`}
          >
            {submitting ? 'Submitting…' : 'Submit & Complete'}
          </button>
          <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Back</button>
          <div className="ml-auto text-sm text-gray-500">Tip: include a Drive link for file uploads</div>
        </div>
      </div>

      <Toast text={toast} />
    </div>
  );
};

export default StudentAssignment;
