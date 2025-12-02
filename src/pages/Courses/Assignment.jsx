import React, { useState } from 'react';

const Assignment = ({ courseId }) => {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save assignment locally for demo
    const key = `assignments_${courseId}`;
    const arr = JSON.parse(localStorage.getItem(key) || '[]');
    arr.push({ id: Date.now(), value, submittedAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(arr));
    setSubmitted(true);
  };

  return (
    <div>
      <h4 className="font-semibold mb-2">Assignment</h4>
      {submitted ? (
        <div className="text-sm text-green-600">Submitted successfully.</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input value={value} onChange={e => setValue(e.target.value)} placeholder="Google Drive link or text answer" className="w-full border rounded px-3 py-2" />
          <button type="submit" className="px-3 py-1 bg-[#0D3056] text-white rounded">Submit</button>
        </form>
      )}
    </div>
  );
};

export default Assignment;
