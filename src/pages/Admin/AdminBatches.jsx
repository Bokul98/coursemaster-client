import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AdminBatches = () => {
  const { courseId } = useParams();
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '' });

  useEffect(() => {
    fetch(`/admin/courses/${courseId}/batches`, { headers: authHeader() })
      .then(r => r.json())
      .then(setBatches)
      .catch(() => setBatches([]));
  }, [courseId]);

  const authHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch(`/admin/courses/${courseId}/batches`, { method: 'POST', headers: authHeader(), body: JSON.stringify(form) });
    if (res.ok) {
      const data = await res.json();
      setBatches([data, ...batches]);
      setForm({ name: '', startDate: '', endDate: '' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-4">Batches for Course {courseId}</h1>

      <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-6">
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Batch name" className="w-full border rounded px-3 py-2 mb-2" />
        <div className="grid grid-cols-2 gap-2">
          <input value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} placeholder="Start date (YYYY-MM-DD)" className="w-full border rounded px-3 py-2" />
          <input value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} placeholder="End date (optional)" className="w-full border rounded px-3 py-2" />
        </div>
        <button className="mt-3 px-3 py-1 bg-[#0D3056] text-white rounded">Create Batch</button>
      </form>

      <div className="grid gap-3">
        {batches.map(b => (
          <div key={b._id} className="bg-white p-3 rounded shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{b.name}</div>
                <div className="text-sm text-gray-500">{b.startDate ? new Date(b.startDate).toLocaleDateString() : ''} - {b.endDate ? new Date(b.endDate).toLocaleDateString() : 'ongoing'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBatches;
