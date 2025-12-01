import React from "react";

const Courses = () => {
    const courses = [
        { id: 1, title: "React for Beginners", instructor: "John Doe", price: 49 },
        { id: 2, title: "Advanced Node.js", instructor: "Jane Smith", price: 59 },
        { id: 3, title: "UI/UX Design", instructor: "Mary Johnson", price: 39 },
        { id: 4, title: "Data Science Basics", instructor: "James Brown", price: 69 },
        { id: 5, title: "Marketing Mastery", instructor: "Linda White", price: 29 },
        { id: 6, title: "Python for Everyone", instructor: "Robert King", price: 55 },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">

            <h1 className="text-3xl font-bold mb-8 text-center">All Courses</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {courses.map(course => (
                    <div
                        key={course.id}
                        className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition"
                    >
                        {/* Image placeholder */}
                        <div className="h-40 bg-gray-200"></div>

                        {/* Course Info */}
                        <div className="p-4">
                            <h2 className="font-semibold text-lg mb-1">{course.title}</h2>
                            <p className="text-gray-500 text-sm mb-2">Instructor: {course.instructor}</p>
                            <p className="font-bold text-[#0D3056] mb-3">${course.price}</p>
                            <a
                                href={`/courses/${course.id}`}
                                className="block text-center bg-[#0D3056] text-white py-2 rounded hover:bg-[#0A2440] transition"
                            >
                                View Details
                            </a>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default Courses;
