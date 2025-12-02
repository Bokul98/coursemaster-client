import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Assignment from './Assignment';
import Quiz from './Quiz';

const sampleCourseLessons = {
  1: [
    { id: 'l1', title: 'Intro to React', video: 'https://www.youtube.com/embed/dGcsHMXbSOA' },
    { id: 'l2', title: 'Components & Props', video: 'https://www.youtube.com/embed/Ke90Tje7VS0' },
    { id: 'l3', title: 'State & Hooks', video: 'https://www.youtube.com/embed/DPnqb74Smug' }
  ],
  2: [
    { id: 'n1', title: 'Node Streams', video: 'https://www.youtube.com/embed/8aGhZQkoFbQ' }
  ]
};

const CoursePlayer = () => {
  const { id } = useParams();
  const [lessons, setLessons] = useState([]);
  const [current, setCurrent] = useState(null);
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem('completedLessons') || '{}'));

  useEffect(() => {
    const ls = sampleCourseLessons[id] || [];
    setLessons(ls);
    setCurrent(ls[0] || null);
  }, [id]);

  const toggleComplete = (lessonId) => {
    const next = { ...completed };
    next[lessonId] = !next[lessonId];
    setCompleted(next);
    localStorage.setItem('completedLessons', JSON.stringify(next));

    // Update enrolled course progress if applicable
    const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    const courseIndex = enrolled.findIndex(c => String(c.id) === String(id));
    if (courseIndex !== -1) {
      const total = lessons.length || 1;
      const done = lessons.filter(l => next[l.id]).length;
      enrolled[courseIndex].progress = Math.round((done / total) * 100);
      localStorage.setItem('enrolledCourses', JSON.stringify(enrolled));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {current ? (
            <div>
              <h2 className="text-xl font-semibold mb-2">{current.title}</h2>
              <div className="w-full aspect-video bg-black">
                <iframe className="w-full h-full" src={current.video} title={current.title} allowFullScreen />
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button onClick={() => toggleComplete(current.id)} className="px-4 py-2 bg-green-600 text-white rounded">
                  {completed[current.id] ? 'Completed' : 'Mark as Completed'}
                </button>
              </div>
            </div>
          ) : (
            <div>No lesson selected</div>
          )}
        </div>

        <aside className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Lessons</h3>
          <ul className="space-y-2">
            {lessons.map(lesson => (
              <li key={lesson.id} className="flex items-center justify-between">
                <button className="text-left" onClick={() => setCurrent(lesson)}>{lesson.title}</button>
                <span className={`text-sm ${completed[lesson.id] ? 'text-green-600' : 'text-gray-400'}`}>
                  {completed[lesson.id] ? 'Done' : 'Todo'}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Assignment courseId={id} />
          </div>

          <div className="mt-6">
            <Quiz courseId={id} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CoursePlayer;
