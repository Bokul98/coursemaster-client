import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// Logo import removed: header is provided by AdminLayout

const AdminBatches = () => {
  const { courseId } = useParams();
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const url = courseId ? `http://localhost:5000/admin/courses/${courseId}/batches` : `http://localhost:5000/admin/batches`;
        const res = await fetch(url, { headers: authHeader() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load');
        setBatches(Array.isArray(data) ? data : []);
      } catch (err) {
        setBatches([]);
      }
    };
    load();
  }, [courseId]);

  const authHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/admin/courses/${courseId}/batches`, { method: 'POST', headers: authHeader(), body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create');
      setBatches(prev => [data, ...prev]);
      setForm({ name: '', startDate: '', endDate: '' });
    } catch (err) {
      alert(err.message || 'Create failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this batch?')) return;
    try {
      // server exposes delete as DELETE /admin/batches/:id
      const res = await fetch(`http://localhost:5000/admin/batches/${id}`, { method: 'DELETE', headers: authHeader() });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Failed to delete');
      setBatches(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {courseId ? (
        <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-6">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Batch name" className="w-full border rounded px-3 py-2 mb-2" />
          <div className="grid grid-cols-2 gap-2">
            <input value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} placeholder="Start date (YYYY-MM-DD)" className="w-full border rounded px-3 py-2" />
            <input value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} placeholder="End date (optional)" className="w-full border rounded px-3 py-2" />
          </div>
          <button className="mt-3 px-3 py-1 bg-[#0D3056] text-white rounded">Create Batch</button>
        </form>
      ) : (
        <div className="mb-4 text-sm text-gray-600">Viewing all batches. To create a batch, open a course and create a batch for it.</div>
      )}

      <div className="space-y-3">
        {batches.map(b => (
          <div key={b._id} className="bg-white p-4 rounded shadow flex items-center justify-between">
            <div>
              <div className="font-semibold">{b.name}</div>
              <div className="text-sm text-gray-500">{b.startDate ? new Date(b.startDate).toLocaleDateString() : ''} - {b.endDate ? new Date(b.endDate).toLocaleDateString() : 'ongoing'}</div>
            </div>
            <div>
              <button onClick={() => handleDelete(b._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBatches;
