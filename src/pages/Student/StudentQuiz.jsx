import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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

const StudentQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState('0');
  const [enrollment, setEnrollment] = useState(null);
  const [scoreResult, setScoreResult] = useState(null);

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
      } catch (err) { console.error(err); }
    };
    load();
  }, [id]);

  const lessons = getLessonsFromCourse(course);

  const handleComplete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return navigate('/login');
      // simple mock scoring: if any option selected, score = 1/1
      const score = selected !== null ? 1 : 0;
      const total = 1;
      const res = await fetch(`${API}/student/quizzes`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId: id, score, total, lessonId: selectedLesson }) });
      if (!res.ok) throw new Error('Quiz submit failed');

      // mark quiz token
      const tokenKey = `l:${selectedLesson}:q`;
      const existing = Array.isArray(enrollment?.lessonsCompleted) ? enrollment.lessonsCompleted : [];
      const merged = Array.from(new Set([...existing, tokenKey]));
      const totalTasks = Math.max(lessons.length * 3, 3);
      const progressValue = Math.round((merged.length / totalTasks) * 100);
      await fetch(`${API}/student/enrollments/${id}/progress`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ progress: progressValue, lessonsCompleted: merged }) });

      setScoreResult({ score, total });
      // show immediate score and navigate back with toast after a short delay
      setTimeout(() => navigate('/student', { state: { toast: `${course?.title || id} quiz submitted (${score}/${total})` } }), 1500);
    } catch (err) {
      console.error(err);
      navigate('/student', { state: { toast: 'Could not submit quiz' } });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quiz: {course?.title || id}</h2>
        <p className="text-sm text-gray-600 mb-4">Multiple-choice quiz. Immediate scoring upon submit.</p>

        <label className="block text-sm text-gray-500 mb-1">Lesson</label>
        <select value={selectedLesson} onChange={e => setSelectedLesson(e.target.value)} className="w-full border rounded px-3 py-2 mb-3">
          {lessons.map(ls => <option key={ls.id} value={ls.id}>{ls.title}</option>)}
        </select>

        <div className="space-y-3 mb-4">
          {['A) Option one','B) Option two','C) Option three','D) Option four'].map((opt, i) => (
            <div key={opt} className={`p-3 border rounded cursor-pointer ${selected === i ? 'bg-blue-50 border-blue-200' : ''}`} onClick={() => setSelected(i)}>{opt}</div>
          ))}
        </div>

        {scoreResult && <div className="mb-3 text-green-600 font-medium">You scored {scoreResult.score}/{scoreResult.total}</div>}

        <div className="flex items-center gap-3">
          <button onClick={handleComplete} className="px-4 py-2 bg-green-600 text-white rounded">Submit & Complete</button>
          <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Back</button>
        </div>
      </div>
    </div>
  );
};

export default StudentQuiz;
