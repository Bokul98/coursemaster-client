import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const Home = () => {
    const API = 'http://localhost:5000';
    const categories = ["Web Development", "Design", "Marketing", "Data Science"];
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API}/courses`);
                if (!res.ok) throw new Error('Failed to load courses');
                const data = await res.json();
                const items = data?.items || data || [];
                if (mounted) setCourses(items);
            } catch (err) {
                if (mounted) setError(err.message || 'Could not load courses');
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, []);

    const features = [
        "Expert Instructors",
        "Lifetime Access",
        "Certification",
        "Affordable Price",
    ];

    return (
        <div className="w-full font-sans text-gray-800">

            {/* HERO */}
            <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-[#0D3056]">
                        Learn New Skills & Build Your Future
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl">
                        Explore thousands of structured courses designed by industry experts.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <a
                            href="/courses"
                            className="bg-[#0D3056] text-white px-6 py-3 rounded-lg hover:bg-[#0a2642] transition"
                        >
                            Browse Courses
                        </a>
                        <a
                            href="/register"
                            className="border border-[#0D3056] text-[#0D3056] px-6 py-3 rounded-lg hover:bg-[#0D3056] hover:text-white transition"
                        >
                            Join Now
                        </a>
                    </div>
                </div>

                <div className="hidden md:flex justify-center">
                    <img
                        src="/src/assets/hero.png"
                        alt="Hero"
                        className="w-full max-w-md object-contain"
                    />
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Popular Categories</h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {categories.map((cat, i) => (
                        <div
                            key={i}
                            className="p-6 bg-white shadow-md rounded-xl text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
                        >
                            <span className="text-lg font-semibold">{cat}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* FEATURED COURSES */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Popular Courses</h2>
                {loading && <div className="text-center text-sm text-gray-500">Loading courses…</div>}
                {error && <div className="text-center text-sm text-red-600">{error}</div>}
                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {courses.map((c) => (
                            <div key={c._id || c.id} className="bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition transform hover:-translate-y-1">
                                <div className="h-40 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                                    <img src={c.metadata?.image || `https://source.unsplash.com/400x200/?${encodeURIComponent(c.title || 'course')}`} alt={c.title} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-semibold text-lg mb-1">{c.title}</h3>
                                <p className="text-gray-500 text-sm mb-2">{c.instructor || 'Instructor'}</p>
                                <p className="font-bold text-[#0D3056] mb-3">{typeof c.price === 'number' ? `$${c.price}` : (c.price || 'Free')}</p>
                                <Link to={`/courses/${c._id || c.id}`} className="block text-center bg-[#0D3056] text-white py-2 rounded-lg hover:bg-[#0a2642] transition">View Details</Link>
                            </div>
                        ))}
                    </div>
                )}
            </section>
            {/* logo-animation */}
            <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center bg-black rounded-xl">

                {/* LEFT: Text */}
                <div className="space-y-6 pl-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Start Learning Today
                    </h2>
                    <p className="text-gray-300 text-lg md:text-xl">
                        Watch our platform come to life with our animated logo and see how easy learning can be.
                    </p>
                    <a
                        href="/courses"
                        className="bg-[#0D3056] text-white px-8 py-4 rounded-lg hover:bg-[#0a2642] transition inline-block"
                    >
                        Browse Courses
                    </a>
                </div>

                {/* RIGHT: Smaller Video */}
                <div className="w-full flex justify-center md:justify-center">
                    <video
                        src="/src/assets/logo-animation.mp4"
                        autoPlay
                        loop
                        muted
                        className="w-1/2 max-w-sm rounded-lg"
                    />
                </div>
            </section>
            {/* WHY CHOOSE US */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Why Choose CourseMaster?</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {features.map((item, i) => (
                            <div
                                key={i}
                                className="bg-white p-6 shadow-md rounded-xl text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
                            >
                                <h3 className="font-semibold text-lg">{item}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
