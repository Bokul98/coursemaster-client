import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
// removed unused Logo import; header is provided by AdminLayout

const AdminCourseForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ title: '', description: '', price: 0, instructor: '', syllabus: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/admin/courses/${id}`, { headers: authHeader() })
        .then(r => r.json())
        .then(data => setForm({ ...data, syllabus: (data.syllabus || []).join('\n') }))
        .catch(() => {});
    }
  }, [id]);

  const authHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, syllabus: form.syllabus.split('\n').map(s => s.trim()).filter(Boolean) };
    const url = id ? `http://localhost:5000/admin/courses/${id}` : 'http://localhost:5000/admin/courses';
    const method = id ? 'PATCH' : 'POST';
    setSubmitting(true);
    setErrors(null);
    try {
      const res = await fetch(url, { method, headers: authHeader(), body: JSON.stringify(payload) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Failed to save');
      navigate('/admin/courses');
    } catch (err) {
      setErrors(err.message || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState(null);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        {errors && <div className="text-sm text-red-600">{errors}</div>}
        <label className="block">
          <div className="text-sm font-medium mb-1">Title</div>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full border rounded px-3 py-2" />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <div className="text-sm font-medium mb-1">Instructor</div>
            <input value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} placeholder="Instructor" className="w-full border rounded px-3 py-2" />
          </label>

          <label className="block">
            <div className="text-sm font-medium mb-1">Price</div>
            <input value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} placeholder="Price" type="number" className="w-full border rounded px-3 py-2" />
          </label>
        </div>

        <label className="block">
          <div className="text-sm font-medium mb-1">Description</div>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="w-full border rounded px-3 py-2" />
        </label>

        <label className="block">
          <div className="text-sm font-medium mb-1">Syllabus (one item per line)</div>
          <textarea value={form.syllabus} onChange={e => setForm({ ...form, syllabus: e.target.value })} placeholder="Syllabus (one item per line)" className="w-full border rounded px-3 py-2" />
        </label>

        <div className="flex gap-2">
          <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#0D3056] text-white rounded">{submitting ? 'Saving…' : 'Save'}</button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AdminCourseForm;
