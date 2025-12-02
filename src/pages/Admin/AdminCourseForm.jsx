import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AdminCourseForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ title: '', description: '', price: 0, instructor: '', syllabus: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetch(`/admin/courses/${id}`, { headers: authHeader() })
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
    const url = id ? `/admin/courses/${id}` : '/admin/courses';
    const method = id ? 'PATCH' : 'POST';
    const res = await fetch(url, { method, headers: authHeader(), body: JSON.stringify(payload) });
    if (res.ok) navigate('/admin/courses');
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Course' : 'Create Course'}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full border rounded px-3 py-2" />
        <input value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} placeholder="Instructor" className="w-full border rounded px-3 py-2" />
        <input value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} placeholder="Price" type="number" className="w-full border rounded px-3 py-2" />
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="w-full border rounded px-3 py-2" />
        <textarea value={form.syllabus} onChange={e => setForm({ ...form, syllabus: e.target.value })} placeholder="Syllabus (one item per line)" className="w-full border rounded px-3 py-2" />

        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-[#0D3056] text-white rounded">Save</button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AdminCourseForm;
