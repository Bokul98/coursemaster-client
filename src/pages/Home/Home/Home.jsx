import React from "react";

const Home = () => {
    return (
        <div className="w-full">

            {/* HERO */}
            <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Learn New Skills & Build Your Future
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Explore thousands of structured courses designed by industry experts.
                    </p>

                    <div className="flex gap-4">
                        <a href="/courses" className="bg-[#0D3056] text-white px-6 py-3 rounded-lg">
                            Browse Courses
                        </a>
                        <a href="/register" className="border border-[#0D3056] text-[#0D3056] px-6 py-3 rounded-lg">
                            Join Now
                        </a>
                    </div>
                </div>

                <div className="hidden md:flex justify-center">
                    <img
                        src="/src/assets/hero.png"
                        alt="Hero"
                        className="w-4/5"
                    />
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {["Web Development", "Design", "Marketing", "Data Science"].map((cat, i) => (
                        <div
                            key={i}
                            className="p-6 bg-white shadow rounded-xl text-center hover:shadow-lg transition"
                        >
                            {cat}
                        </div>
                    ))}
                </div>
            </section>

            {/* FEATURED COURSES */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold mb-6">Popular Courses</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition">
                            <div className="h-40 bg-gray-200 rounded mb-4"></div>
                            <h3 className="font-semibold mb-1">Course Title</h3>
                            <p className="text-gray-500 text-sm mb-2">Instructor Name</p>
                            <p className="font-bold text-[#0D3056] mb-3">$49</p>
                            <a
                                href="/courses/1"
                                className="block text-center bg-[#0D3056] text-white py-2 rounded"
                            >
                                View Details
                            </a>
                        </div>
                    ))}

                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section className="bg-gray-100 py-14">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl font-bold mb-8 text-center">Why Choose CourseMaster?</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            "Expert Instructors",
                            "Lifetime Access",
                            "Certification",
                            "Affordable Price",
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="bg-white p-6 shadow rounded-xl text-center hover:shadow-md transition"
                            >
                                <h3 className="font-semibold">{item}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="text-center py-16">
                <h2 className="text-3xl font-bold mb-4">Start Learning Today</h2>
                <a
                    href="/courses"
                    className="bg-[#0D3056] text-white px-8 py-3 rounded-lg"
                >
                    Browse Courses
                </a>
            </section>

        </div>
    );
};

export default Home;
