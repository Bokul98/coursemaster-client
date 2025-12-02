import React, { useState } from 'react';

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

// Props: courseId (required), moduleId (optional)
const Quiz = ({ courseId, moduleId = 'default' }) => {
  const quiz = (sampleQuizzes[courseId] && sampleQuizzes[courseId][moduleId]) || [];
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const handleChange = (qid, idx) => {
    setAnswers({ ...answers, [qid]: idx });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let correct = 0;
    quiz.forEach(q => {
      if (answers[q.id] === q.answer) correct += 1;
    });
    const result = { correct, total: quiz.length, answers, submittedAt: new Date().toISOString() };
    setScore(result);

    // persist quiz submission per-course+module for review
    const key = `quiz_submissions_${courseId}_${moduleId}`;
    const arr = JSON.parse(localStorage.getItem(key) || '[]');
    arr.push({ id: Date.now(), ...result });
    localStorage.setItem(key, JSON.stringify(arr));
  };

  if (quiz.length === 0) return <div className="text-sm text-gray-500">No quiz available for this module.</div>;

  return (
    <div>
      <h4 className="font-semibold mb-2">Quiz</h4>
      {score ? (
        <div className="text-sm text-green-600">You scored {score.correct} / {score.total}</div>
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
