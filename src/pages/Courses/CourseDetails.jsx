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
                    syllabus: data.syllabus || []
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
