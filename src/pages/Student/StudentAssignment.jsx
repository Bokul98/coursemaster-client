import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const StudentAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleComplete = () => {
    localStorage.setItem(`course_complete_${id}`, 'true');
    navigate('/student', { state: { toast: `${id} marked complete` } });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Assignment: Course {id}</h2>
        <p className="text-sm text-gray-600 mb-4">Submit your answer or upload a link (design-only).</p>

        <label className="block text-sm text-gray-500 mb-1">Answer</label>
        <textarea className="w-full border rounded px-3 py-2 mb-3" rows={6} />

        <div className="flex items-center gap-3">
          <button onClick={handleComplete} className="px-4 py-2 bg-green-600 text-white rounded">Submit & Complete</button>
          <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Back</button>
        </div>
      </div>
    </div>
  );
};

export default StudentAssignment;
