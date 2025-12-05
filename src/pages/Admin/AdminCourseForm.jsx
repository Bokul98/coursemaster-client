import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
// removed unused Logo import; header is provided by AdminLayout

const AdminCourseForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ title: '', description: '', price: 0, instructor: '', syllabus: '', metadata: {} });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetch(`https://coursemaster-ruddy.vercel.app/admin/courses/${id}`, { headers: authHeader() })
        .then(r => r.json())
        .then(data => setForm({ ...data, syllabus: (data.syllabus || []).join('\n') }))
        .catch(() => { });
    }
  }, [id]);

  const authHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
  };

  const handleImageFile = async (file) => {
    if (!file) return;
    setImageError(null);
    setUploadingImage(true);
    try {
      // convert to base64
      const toBase64 = (f) => new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result);
        reader.onerror = rej;
        reader.readAsDataURL(f);
      });
      const base64 = await toBase64(file);
      const res = await fetch('https://coursemaster-ruddy.vercel.app/admin/upload-image', { method: 'POST', headers: authHeader(), body: JSON.stringify({ image: base64 }) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Upload failed');
      const url = body.url;
      setForm(prev => ({ ...prev, metadata: { ...(prev.metadata || {}), image: url } }));
    } catch (err) {
      console.error(err);
      setImageError(err.message || 'Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, syllabus: form.syllabus.split('\n').map(s => s.trim()).filter(Boolean) };
    const url = id ? `https://coursemaster-ruddy.vercel.app/admin/courses/${id}` : 'https://coursemaster-ruddy.vercel.app/admin/courses';
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
        {errors && <div className="text-sm text-red-600">{errors}</div>}

        <label className="block">
          <div className="text-sm font-semibold mb-2 text-gray-700">Title</div>
          <input
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Course Title"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <div className="text-sm font-semibold mb-2 text-gray-700">Instructor</div>
            <input
              value={form.instructor}
              onChange={e => setForm({ ...form, instructor: e.target.value })}
              placeholder="Instructor Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </label>

          <label className="block">
            <div className="text-sm font-semibold mb-2 text-gray-700">Price</div>
            <input
              value={form.price}
              onChange={e => setForm({ ...form, price: Number(e.target.value) })}
              placeholder="Price"
              type="number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </label>
        </div>

        <label className="block">
          <div className="text-sm font-semibold mb-2 text-gray-700">Description</div>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Course Description"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            rows={4}
          />
        </label>

        <label className="block">
          <div className="text-sm font-semibold mb-2 text-gray-700">Syllabus (one item per line)</div>
          <textarea
            value={form.syllabus}
            onChange={e => setForm({ ...form, syllabus: e.target.value })}
            placeholder="Enter syllabus items..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            rows={4}
          />
        </label>

        <label className="block">
          <div className="text-sm font-semibold mb-2 text-gray-700">Course Image</div>
          {form.metadata?.image && (
            <div className="mb-3">
              <img
                src={form.metadata.image}
                alt="Preview"
                className="w-full sm:w-64 h-36 sm:h-40 object-cover rounded-lg shadow-sm"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={e => handleImageFile(e.target.files?.[0])}
            className="text-sm text-gray-600"
          />
          {uploadingImage && <div className="text-sm text-gray-500 mt-1">Uploading…</div>}
          {imageError && <div className="text-sm text-red-600 mt-1">{imageError}</div>}
        </label>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-blue-600 transition"
          >
            {submitting ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-5 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCourseForm;
