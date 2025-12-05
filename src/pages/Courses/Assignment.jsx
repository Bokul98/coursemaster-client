import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Props: courseId (optional), moduleId (optional)
const Assignment = (props) => {
  const params = useParams();
  const navigate = useNavigate();
  const courseId = props.courseId || params.id;
  const moduleId = props.moduleId || params.lessonIndex || 'default';

  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // fallback to local behavior
      const key = `assignments_${courseId}_${moduleId}`;
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      arr.push({ id: Date.now(), value, submittedAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(arr));
      setSubmitted(true);
      setMessage('Saved locally (not logged in)');
      return;
    }

    try {
      const res = await fetch('https://coursemaster-ruddy.vercel.app/student/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseId, content: value, moduleId: moduleId || null, lessonId: moduleId || null })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Submission failed');
      setSubmitted(true);
      setMessage('Submitted to server');
    } catch (err) {
      // fallback to local storage
      const key = `assignments_${courseId}_${moduleId}`;
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      arr.push({ id: Date.now(), value, submittedAt: new Date().toISOString(), offline: true });
      localStorage.setItem(key, JSON.stringify(arr));
      setSubmitted(true);
      setMessage('Saved locally (server error)');
    }
  };

  return (
    <div>
      <h4 className="font-semibold mb-2">Assignment</h4>
      {submitted ? (
        <div className="text-sm text-green-600">{message || 'Submitted successfully.'}</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input value={value} onChange={e => setValue(e.target.value)} placeholder="Google Drive link or text answer" className="w-full border rounded px-3 py-2" />
          <div className="flex gap-2">
            <button type="submit" className="px-3 py-1 bg-[#0D3056] text-white rounded">Submit</button>
            <button type="button" onClick={() => navigate(-1)} className="px-3 py-1 border rounded">Back</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Assignment;
