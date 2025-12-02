import React from "react";
import { useParams, useNavigate } from "react-router";
import { isAuthenticated } from "../../utils/auth";

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const courses = [
        { id: 1, title: "React for Beginners", instructor: "John Doe", price: 49, description: "Learn React from scratch.", syllabus: ["Intro", "Components", "State & Props", "Routing"] },
        { id: 2, title: "Advanced Node.js", instructor: "Jane Smith", price: 59, description: "Deep dive into Node.js internals.", syllabus: ["Streams", "Clustering", "Performance"] },
        { id: 3, title: "UI/UX Design", instructor: "Mary Johnson", price: 39, description: "Design beautiful user experiences.", syllabus: ["Design Principles", "Figma", "Prototyping"] },
        { id: 4, title: "Data Science Basics", instructor: "James Brown", price: 69, description: "Intro to data analysis and ML.", syllabus: ["Python", "Pandas", "ML Basics"] },
        { id: 5, title: "Marketing Mastery", instructor: "Linda White", price: 29, description: "Marketing fundamentals for growth.", syllabus: ["SEO", "Content", "Analytics"] },
        { id: 6, title: "Python for Everyone", instructor: "Robert King", price: 55, description: "Start programming with Python.", syllabus: ["Syntax", "OOP", "Web"] },
    ];

    const course = courses.find(c => String(c.id) === String(id));

    if (!course) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold">Course not found</h2>
            </div>
        );
    }

    const handleEnroll = () => {
        if (!isAuthenticated()) {
            // If guest, redirect to login
            navigate('/login');
            return;
        }

        // Minimal behavior for now: proceed to enrollment/payment flow (not implemented)
        // You can replace this with a real flow later.
        alert('Proceed to enrollment / payment flow (not implemented)');
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="bg-white shadow rounded-xl p-6">
                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                <p className="text-sm text-gray-500 mb-4">Instructor: {course.instructor}</p>
                <p className="mb-4">{course.description}</p>

                <h3 className="font-semibold mb-2">Syllabus</h3>
                <ul className="list-disc list-inside mb-4">
                    {course.syllabus.map((s, i) => (
                        <li key={i}>{s}</li>
                    ))}
                </ul>

                <div className="flex items-center justify-between gap-4">
                    <p className="text-2xl font-bold text-[#0D3056]">${course.price}</p>
                    <button
                        onClick={handleEnroll}
                        className="bg-[#0D3056] text-white px-6 py-2 rounded-lg hover:bg-[#0A2440] transition"
                    >
                        Enroll Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
