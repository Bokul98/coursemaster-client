import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const StudentWatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleComplete = () => {
    localStorage.setItem(`course_complete_${id}`, 'true');
    navigate('/student', { state: { toast: `${id} marked complete` } });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Watch: Course {id}</h2>
        <div className="mb-4 text-sm text-gray-600">This is the lesson video (design-only).</div>
        <div className="aspect-w-16 aspect-h-9 bg-black mb-4">
          <iframe title="video" src="about:blank" className="w-full h-64" />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleComplete} className="px-4 py-2 bg-green-600 text-white rounded">Mark Task Complete</button>
          <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Back</button>
        </div>
      </div>
    </div>
  );
};

export default StudentWatch;
