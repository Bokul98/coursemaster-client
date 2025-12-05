import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:5000/courses/${id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Not found');
                setCourse({
                    id: data._id,
                    title: data.title,
                    instructor: data.instructor,
                    price: data.price,
                    description: data.description || data.metadata?.description || '',
                    syllabus: data.syllabus || [],
                    image: data.metadata?.image || (data.metadata?.image === '' ? '' : null)
                });
            } catch (err) {
                setError(err.message || 'Failed to load');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handleEnroll = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/student/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ courseId: id })
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Enrollment failed');

            // Update local enrolled state for quick UI
            const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
            if (!enrolled.find(c => String(c.id) === String(id))) {
                enrolled.push({ id, title: course?.title || 'Course', progress: 0 });
                localStorage.setItem('enrolledCourses', JSON.stringify(enrolled));
            }
            navigate('/student');
        } catch (err) {
            alert(err.message || 'Enrollment failed');
        }
    };

    if (loading) return <div className="max-w-3xl mx-auto px-6 py-12">Loading…</div>;
    if (error || !course) return <div className="max-w-3xl mx-auto px-6 py-12">Course not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 transition-transform hover:scale-[1.02] duration-300">

                {/* Course Image */}
                {course.image && (
                    <div className="h-60 md:h-72 mb-6 overflow-hidden rounded-xl shadow-inner">
                        <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                    </div>
                )}

                {/* Title & Instructor */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{course.title}</h1>
                <p className="text-sm md:text-base text-gray-500 mb-6">Instructor: <span className="font-medium text-gray-700">{course.instructor}</span></p>

                {/* Description */}
                <p className="text-gray-700 text-sm md:text-base mb-6 leading-relaxed">{course.description}</p>

                {/* Syllabus */}
                {course.syllabus.length > 0 && (
                    <>
                        <h3 className="font-semibold text-gray-800 mb-3 text-lg">Syllabus</h3>
                        <ul className="list-disc list-inside space-y-1 mb-6 text-gray-700 text-sm md:text-base">
                            {course.syllabus.map((s, i) => (
                                <li key={i} className="hover:text-[#0D3056] transition-colors">{s}</li>
                            ))}
                        </ul>
                    </>
                )}

                {/* Price & Enroll */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                    <p className="text-3xl md:text-4xl font-bold text-[#0D3056]">${course.price}</p>
                    <button
                        onClick={handleEnroll}
                        className="bg-[#0D3056] text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:bg-[#0A2440] hover:shadow-lg transition-all duration-300"
                    >
                        Enroll Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
