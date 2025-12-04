import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);

    // UI state for client-side features
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState(""); // "price_asc" | "price_desc"
    const [category, setCategory] = useState("all");
    const [page, setPage] = useState(1);
    const pageSize = 12;

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                params.set('page', page);
                params.set('limit', pageSize);
                if (query.trim()) params.set('q', query.trim());
                if (sort) params.set('sort', sort);
                if (category && category !== 'all') params.set('category', category);

                const res = await fetch(`http://localhost:5000/courses?${params.toString()}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to load courses');

                // data: { items, total, page, limit }
                const mapped = (data.items || []).map(c => ({
                    id: c._id || c.id,
                    title: c.title || 'Untitled',
                    instructor: c.instructor || '',
                    price: c.price || 0,
                    category: c.category || (c.metadata?.category) || 'General',
                    syllabus: c.syllabus || [],
                    description: c.description || c.metadata?.description || ''
                }));

                setCourses(mapped);
                // update pagination based on server response
                const pages = Math.max(1, Math.ceil((data.total || 0) / (data.limit || pageSize)));
                setTotalPages(pages);
            } catch (err) {
                setError(err.message || 'Failed to load');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [query, sort, category, page]);

    const categories = useMemo(() => ["all", ...Array.from(new Set(courses.map((c) => c.category || 'General')))], [courses]);

    const filtered = useMemo(() => {
        let out = courses.slice();

        // Search by title or instructor
        if (query.trim()) {
            const q = query.toLowerCase();
            out = out.filter(
                (c) => c.title.toLowerCase().includes(q) || (c.instructor || '').toLowerCase().includes(q)
            );
        }

        // Category filter
        if (category !== "all") {
            out = out.filter((c) => c.category === category);
        }

        // Sorting
        if (sort === "price_asc") out.sort((a, b) => a.price - b.price);
        if (sort === "price_desc") out.sort((a, b) => b.price - a.price);

        return out;
    }, [courses, query, sort, category]);

    // server-driven pagination: clamp page when totalPages changes
    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const pageItems = courses;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-6 text-center">All Courses</h1>

            {loading && <div className="text-center text-sm text-gray-500 mb-4">Loading courses…</div>}
            {error && <div className="text-center text-sm text-red-500 mb-4">{error}</div>}

            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div className="flex items-center gap-2 w-full md:w-1/2">
                    <input
                        value={query}
                        onChange={e => { setQuery(e.target.value); setPage(1); }}
                        placeholder="Search by title or instructor"
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={sort}
                        onChange={e => setSort(e.target.value)}
                        className="border rounded px-3 py-2"
                    >
                        <option value="">Sort</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>

                    <select
                        value={category}
                        onChange={e => { setCategory(e.target.value); setPage(1); }}
                        className="border rounded px-3 py-2"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {pageItems.map(course => (
                    <div
                        key={course.id}
                        className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition"
                    >
                        <div className="h-40 bg-gray-200" />

                        <div className="p-4">
                            <h2 className="font-semibold text-lg mb-1">{course.title}</h2>
                            <p className="text-gray-500 text-sm mb-2">Instructor: {course.instructor}</p>
                            <p className="text-sm text-gray-400 mb-2">{course.category}</p>
                            <p className="font-bold text-[#0D3056] mb-3">${course.price}</p>
                            <Link
                                to={`/courses/${course.id}`}
                                className="block text-center bg-[#0D3056] text-white py-2 rounded hover:bg-[#0A2440] transition"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-8">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Prev
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`px-3 py-1 border rounded ${page === i + 1 ? 'bg-[#0D3056] text-white' : ''}`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>

        </div>
    );
};

export default Courses;
