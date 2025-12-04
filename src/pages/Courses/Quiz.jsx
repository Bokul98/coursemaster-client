import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// sample quizzes keyed by courseId -> moduleId could be extended
const sampleQuizzes = {
  1: {
    default: [
      {
        id: 'q1',
        question: 'What is React primarily used for?',
        options: ['Styling', 'Backend APIs', 'Building user interfaces', 'Database'],
        answer: 2
      },
      {
        id: 'q2',
        question: 'Which hook is used for state?',
        options: ['useEffect', 'useState', 'useMemo', 'useRef'],
        answer: 1
      }
    ]
  }
};

// Props: courseId (optional), moduleId (optional)
const Quiz = (props) => {
  const params = useParams();
  const navigate = useNavigate();
  const courseId = props.courseId || params.id;
  const moduleId = props.moduleId || params.lessonIndex || 'default';

  const quiz = (sampleQuizzes[courseId] && sampleQuizzes[courseId][moduleId]) || [];
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [message, setMessage] = useState(null);

  const handleChange = (qid, idx) => {
    setAnswers({ ...answers, [qid]: idx });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let correct = 0;
    quiz.forEach(q => {
      if (answers[q.id] === q.answer) correct += 1;
    });
    const result = { correct, total: quiz.length, answers, submittedAt: new Date().toISOString() };
    setScore(result);

    // Try to send to server
    const token = localStorage.getItem('accessToken');
    if (!token) {
      const key = `quiz_submissions_${courseId}_${moduleId}`;
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      arr.push({ id: Date.now(), ...result });
      localStorage.setItem(key, JSON.stringify(arr));
      setMessage('Saved locally (not logged in)');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/student/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseId, score: result.correct, total: result.total, moduleId: moduleId || null, lessonId: moduleId || null })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Submission failed');
      setMessage('Submitted to server');
    } catch (err) {
      const key = `quiz_submissions_${courseId}_${moduleId}`;
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      arr.push({ id: Date.now(), ...result, offline: true });
      localStorage.setItem(key, JSON.stringify(arr));
      setMessage('Saved locally (server error)');
    }
  };

  if (quiz.length === 0) return <div className="text-sm text-gray-500">No quiz available for this module.</div>;

  return (
    <div>
      <h4 className="font-semibold mb-2">Quiz</h4>
      {score ? (
        <div>
          <div className="text-sm text-green-600">You scored {score.correct} / {score.total}</div>
          {message && <div className="text-sm text-gray-600">{message}</div>}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {quiz.map(q => (
            <div key={q.id}>
              <div className="font-medium">{q.question}</div>
              <div className="space-y-1 mt-2">
                {q.options.map((opt, i) => (
                  <label key={i} className="flex items-center gap-2">
                    <input type="radio" name={q.id} checked={answers[q.id] === i} onChange={() => handleChange(q.id, i)} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button type="submit" className="px-3 py-1 bg-[#0D3056] text-white rounded">Submit Quiz</button>
        </form>
      )}
    </div>
  );
};

export default Quiz;
