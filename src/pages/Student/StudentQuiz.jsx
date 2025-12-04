import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const StudentQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleComplete = () => {
    localStorage.setItem(`course_complete_${id}`, 'true');
    navigate('/student', { state: { toast: `${id} marked complete` } });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quiz: Course {id}</h2>
        <p className="text-sm text-gray-600 mb-4">Sample multiple-choice (design-only).</p>

        <div className="space-y-3 mb-4">
          <div className="p-3 border rounded">A) Option one</div>
          <div className="p-3 border rounded">B) Option two</div>
          <div className="p-3 border rounded">C) Option three</div>
          <div className="p-3 border rounded">D) Option four</div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleComplete} className="px-4 py-2 bg-green-600 text-white rounded">Submit & Complete</button>
          <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Back</button>
        </div>
      </div>
    </div>
  );
};

export default StudentQuiz;
