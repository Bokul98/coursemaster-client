import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const API = 'https://coursemaster-ruddy.vercel.app/admin';

const formatDate = (d) => d.toISOString().slice(0, 10);

// generate simple placeholder data for the past N days
const generatePlaceholder = (days = 14) => {
  const arr = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    arr.push({ period: formatDate(date), count: Math.floor(Math.random() * 8) + 1 });
  }
  return arr;
};

const AdminAnalytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API}/enrollments/stats`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) throw new Error('No stats available');

        const json = await res.json();
        // Expecting [{ period: 'YYYY-MM-DD', count: number }, ...]
        if (mounted) setData(Array.isArray(json) && json.length ? json : generatePlaceholder());
      } catch (err) {
        // fallback to placeholder demo data when backend endpoint is absent
        if (mounted) {
          setError('');
          setData(generatePlaceholder(14));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Enrollments — Analytics</h1>
          <p className="text-sm text-gray-500">Enrollments over time. This view is a UI-only chart; backend aggregation can be wired later.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">Showing last 14 days</div>
        </div>

        <div style={{ width: '100%', height: 320 }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">Loading…</div>
          ) : (
            <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {error && <div className="text-sm text-yellow-600 mt-3">{error}</div>}
      </div>
    </div>
  );
};

export default AdminAnalytics;
