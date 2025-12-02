import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

// Static course data (kept top-level so hooks don't need it as a dependency)
const courses = [
    {
        id: 1,
        title: "React for Beginners",
        instructor: "John Doe",
        price: 49,
        category: "Web Development",
        tags: ["React", "Frontend"],
    },
    {
        id: 2,
        title: "Advanced Node.js",
        instructor: "Jane Smith",
        price: 59,
        category: "Web Development",
        tags: ["Node.js", "Backend"],
    },
    {
        id: 3,
        title: "UI/UX Design",
        instructor: "Mary Johnson",
        price: 39,
        category: "Design",
        tags: ["Design", "Figma"],
    },
    {
        id: 4,
        title: "Data Science Basics",
        instructor: "James Brown",
        price: 69,
        category: "Data Science",
        tags: ["Python", "Pandas"],
    },
    {
        id: 5,
        title: "Marketing Mastery",
        instructor: "Linda White",
        price: 29,
        category: "Marketing",
        tags: ["SEO", "Content"],
    },
    {
        id: 6,
        title: "Python for Everyone",
        instructor: "Robert King",
        price: 55,
        category: "Programming",
        tags: ["Python"],
    },
];

const Courses = () => {

    // UI state for static client-side features
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState(""); // "price_asc" | "price_desc"
    const [category, setCategory] = useState("all");
    const [page, setPage] = useState(1);
    const pageSize = 6;

    const categories = useMemo(() => ["all", ...Array.from(new Set(courses.map((c) => c.category)))], []);

    const filtered = useMemo(() => {
        let out = courses.slice();

        // Search by title or instructor
        if (query.trim()) {
            const q = query.toLowerCase();
            out = out.filter(
                (c) => c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q)
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
    }, [query, sort, category]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

    // Ensure page in range (useEffect would be better, but keep simple clamp here)
    if (page > totalPages) setPage(totalPages);

    const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">

            <h1 className="text-3xl font-bold mb-6 text-center">All Courses</h1>

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
