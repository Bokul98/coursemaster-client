import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const CoursePlayer = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState({ progress: 0, lessonsCompleted: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/courses/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Course not found');
        setCourse({ id: data._id, title: data.title, syllabus: data.syllabus || [] });

        // fetch enrollment for this course
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Not authenticated');
        const r2 = await fetch('http://localhost:5000/student/enrollments', { headers: { Authorization: `Bearer ${token}` } });
        const enrollments = await r2.json();
        if (!r2.ok) throw new Error(enrollments.error || 'Failed to get enrollment');
        const e = enrollments.find(x => String(x.courseId) === String(id)) || { progress: 0, lessonsCompleted: [] };
        setEnrollment({ progress: e.progress || 0, lessonsCompleted: e.lessonsCompleted || [] });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const toggleComplete = async (lessonIndex) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return alert('Please login to mark complete');
    const lessons = new Set(enrollment.lessonsCompleted || []);
    const key = String(lessonIndex);
    if (lessons.has(key)) lessons.delete(key);
    else lessons.add(key);
    const lessonsArr = Array.from(lessons);
    const progress = course && course.syllabus && course.syllabus.length > 0 ? Math.round((lessonsArr.length / course.syllabus.length) * 100) : 0;

    // Optimistic UI
    setEnrollment({ lessonsCompleted: lessonsArr, progress });

    try {
      const res = await fetch(`http://localhost:5000/student/enrollments/${id}/progress`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ progress, lessonsCompleted: lessonsArr })
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Failed to update');
      }
    } catch (err) {
      alert(err.message || 'Failed to update progress');
    }
  };

  if (loading) return <div className="max-w-3xl mx-auto px-6 py-12">Loading…</div>;
  if (error || !course) return <div className="max-w-3xl mx-auto px-6 py-12">{error || 'Course not found'}</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
        <div className="mb-4">Progress: <span className="font-semibold">{enrollment.progress}%</span></div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="space-y-6">
              {course.syllabus.length === 0 && <div className="text-sm text-gray-500">No lessons defined.</div>}
              {course.syllabus.map((lesson, idx) => {
                // lesson can be a string or object { title, video }
                const title = typeof lesson === 'string' ? lesson : (lesson.title || 'Lesson');
                const video = typeof lesson === 'object' ? lesson.video : (typeof lesson === 'string' && (lesson.includes('youtube') || lesson.includes('vimeo')) ? lesson : null);
                const completed = (enrollment.lessonsCompleted || []).includes(String(idx));
                return (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold">{title}</div>
                        {video && (
                          <div className="mt-2">
                            <div className="aspect-w-16 aspect-h-9">
                              <iframe
                                src={video.includes('youtube') ? video.replace('watch?v=', 'embed/') : video}
                                title={title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-64 rounded"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-500">{completed ? 'Completed' : 'Not completed'}</div>
                        <button onClick={() => toggleComplete(idx)} className={`mt-2 px-3 py-1 rounded ${completed ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                          {completed ? 'Unmark' : 'Mark Complete'}
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Link to={`/courses/${id}/player/assignment/${idx}`} className="px-3 py-1 border rounded">Assignment</Link>
                      <Link to={`/courses/${id}/player/quiz/${idx}`} className="px-3 py-1 border rounded">Quiz</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="hidden md:block">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">Course Outline</div>
              <ol className="list-decimal list-inside mt-3">
                {course.syllabus.map((s, i) => (
                  <li key={i} className={`py-1 ${ (enrollment.lessonsCompleted || []).includes(String(i)) ? 'text-green-600' : '' }`}>{typeof s === 'string' ? s : (s.title || 'Lesson')}</li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
