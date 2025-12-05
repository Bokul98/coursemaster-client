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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      {courseId ? (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl shadow-md space-y-4">
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Batch name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              value={form.startDate}
              onChange={e => setForm({ ...form, startDate: e.target.value })}
              placeholder="Start date (YYYY-MM-DD)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              value={form.endDate}
              onChange={e => setForm({ ...form, endDate: e.target.value })}
              placeholder="End date (optional)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button className="mt-2 w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition">
            Create Batch
          </button>
        </form>
      ) : (
        <div className="text-sm text-gray-500">Viewing all batches. To create a batch, open a course and create a batch for it.</div>
      )}

      <div className="space-y-4">
        {batches.map(b => (
          <div
            key={b._id}
            className="bg-white p-4 rounded-2xl shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 hover:shadow-lg transition"
          >
            <div>
              <div className="font-semibold text-gray-800">{b.name}</div>
              <div className="text-sm text-gray-500">
                {b.startDate ? new Date(b.startDate).toLocaleDateString() : ''} -{' '}
                {b.endDate ? new Date(b.endDate).toLocaleDateString() : 'Ongoing'}
              </div>
            </div>
            <div>
              <button
                onClick={() => handleDelete(b._id)}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBatches;
