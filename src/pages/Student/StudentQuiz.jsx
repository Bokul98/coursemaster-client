import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const API = 'http://localhost:5000';

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

const StudentQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState(null);
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState('0');
  const [enrollment, setEnrollment] = useState(null);
  const [scoreResult, setScoreResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [localToast, setLocalToast] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, eRes] = await Promise.all([
          fetch(`${API}/courses/${id}`),
          (localStorage.getItem('accessToken') ? fetch(`${API}/student/enrollments`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }) : Promise.resolve(null))
        ]);
        let courseData = null;
        if (cRes && cRes.ok) {
          courseData = await cRes.json();
          setCourse(courseData);
          // auto-select first lesson if not provided via location.state
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
      } catch (err) { console.error(err); setLocalToast('Could not load'); setTimeout(() => setLocalToast(null), 1500); }
    };
    load();
    if (location?.state?.lesson !== undefined) setSelectedLesson(String(location.state.lesson));
  }, [id]);

  const lessons = getLessonsFromCourse(course);

  const canTakeQuiz = () => {
    const existing = Array.isArray(enrollment?.lessonsCompleted) ? enrollment.lessonsCompleted : [];
    if (!existing.includes(`l:${selectedLesson}:a`)) return { allowed: false, reason: 'Submit the assignment first' };
    return { allowed: true };
  };

  const handleComplete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return navigate('/login');
      const check = canTakeQuiz();
      if (!check.allowed) { setLocalToast(check.reason); setTimeout(() => setLocalToast(null), 1500); return; }
      if (selected === null) { setLocalToast('Select an option before submitting'); setTimeout(() => setLocalToast(null), 1500); return; }

      setSubmitting(true);
      // mock scoring: correct if option 0 (for demo). Replace with real logic if backend provides.
      const score = selected === 0 ? 1 : 0;
      const total = 1;
      const res = await fetch(`${API}/student/quizzes`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId: id, score, total, lessonId: selectedLesson }) });
      if (!res.ok) throw new Error('Quiz submit failed');

      // mark quiz token
      const tokenKey = `l:${selectedLesson}:q`;
      const existingTokens = Array.isArray(enrollment?.lessonsCompleted) ? enrollment.lessonsCompleted : [];
      const merged = Array.from(new Set([...existingTokens, tokenKey]));
      const totalTasks = Math.max(lessons.length * 3, 3);
      const progressValue = Math.round((merged.length / totalTasks) * 100);
      await fetch(`${API}/student/enrollments/${id}/progress`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ progress: progressValue, lessonsCompleted: merged }) });

      setScoreResult({ score, total });

      // show a hot toast congratulations message and then navigate to dashboard
      try {
        toast.success(`Congratulations — you completed the quiz (${score}/${total})`);
      } catch (e) {
        // fallback to local toast if react-hot-toast isn't available for some reason
        setLocalToast(`You scored ${score}/${total}`);
        setTimeout(() => setLocalToast(null), 1800);
      }

      // if progress is now 100, also mark course complete on server (optional)
      if (progressValue >= 100) {
        await fetch(`${API}/student/enrollments/${id}/progress`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ progress: 100 }) });
      }

      // navigate back to dashboard after a short delay so the toast is visible
      setTimeout(() => navigate('/student'), 1200);
    } catch (err) {
      console.error(err);
      setLocalToast('Could not submit quiz');
      setTimeout(() => setLocalToast(null), 1500);
    } finally {
      setSubmitting(false);
    }
  };

  const existing = Array.isArray(enrollment?.lessonsCompleted) ? enrollment.lessonsCompleted : [];
  const assignDone = existing.includes(`l:${selectedLesson}:a`);
  const quizDone = existing.includes(`l:${selectedLesson}:q`);

  const options = ['Option A - (example)', 'Option B', 'Option C', 'Option D'];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-2">{course?.title || 'Quiz'}</h2>
        <p className="text-sm text-gray-600 mb-4">Answer the question to complete the lesson quiz. You must submit assignment first.</p>

        <label className="block text-sm text-gray-500 mb-1">Syllabus</label>
        <div className="w-full border rounded px-3 py-2 mb-3 bg-gray-50 text-gray-800">{(lessons.find(ls => ls.id === selectedLesson) || {}).title || `Lesson ${selectedLesson}`}</div>

        <div className="mb-4">
          <div className={`inline-block px-2 py-1 rounded text-sm ${assignDone ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-800'}`}>
            {assignDone ? 'Assignment completed' : 'Assignment not completed'}
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {options.map((opt, i) => (
            <div
              key={opt}
              onClick={() => setSelected(i)}
              className={`p-3 border rounded cursor-pointer flex items-center justify-between ${selected === i ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${selected === i ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>{String.fromCharCode(65 + i)}</div>
                <div className="text-sm">{opt}</div>
              </div>
              <div className="text-xs text-gray-400">{/* meta */}</div>
            </div>
          ))}
        </div>

        {scoreResult && <div className="mb-3 text-green-600 font-medium">You scored {scoreResult.score}/{scoreResult.total}</div>}

        <div className="flex items-center gap-3">
          <button
            onClick={handleComplete}
            disabled={submitting || !assignDone || quizDone}
            className={`px-4 py-2 rounded ${(!assignDone || submitting || quizDone) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white'}`}
          >
            {submitting ? 'Submitting…' : (quizDone ? 'Quiz completed' : 'Submit & Complete')}
          </button>
          <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Back</button>
        </div>
      </div>

      <Toaster />
      <Toast text={localToast} />
    </div>
  );
};

export default StudentQuiz;
