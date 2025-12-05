import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AdminAssignments = () => {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const authHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Modal state for viewing a single assignment's details
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAssignment, setModalAssignment] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = courseId ? `http://localhost:5000/admin/courses/${courseId}/assignments` : `http://localhost:5000/admin/assignments`;
        const res = await fetch(url, { headers: authHeader() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load assignments');
        setAssignments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isModalOpen]);

  const openModalWithAssignment = (assignment) => {
    setModalAssignment(assignment);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-12 space-y-6">

      {loading && (
        <div className="p-6 bg-white rounded-2xl shadow-md text-gray-600 font-medium">
          Loading submissions…
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg shadow-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow divide-y divide-gray-100 overflow-hidden">

          {assignments.length === 0 && (
            <div className="p-6 text-gray-500 text-center font-medium">
              No submissions yet.
            </div>
          )}

          {assignments.map(a => (
            <div key={a._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4">
                    <div>
                      <div className="font-semibold text-gray-900">{a.user?.name || a.userId}</div>
                      <div className="text-sm text-gray-500">{a.user?.email || '—'}</div>
                    </div>
                    <div className="text-sm text-gray-500 whitespace-nowrap">
                      Submitted: {new Date(a.submittedAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-gray-700 break-words">
                    {a.content}
                  </div>

                  {a.moduleId && (
                    <div className="mt-2 text-xs text-gray-500">
                      Module: {a.moduleId} {a.lessonId ? `• Lesson: ${a.lessonId}` : ''}
                    </div>
                  )}
                </div>

                <div className="mt-4 md:mt-0 flex-shrink-0 flex flex-col gap-2">
                  <button
                    onClick={() => openModalWithAssignment(a)}
                    className="px-3 py-1 border rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    View
                  </button>
                </div>

              </div>
            </div>
          ))}

        </div>
      )}

      {isModalOpen && modalAssignment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
          aria-modal="true"
          role="dialog"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          <div className="relative z-10 w-full max-w-2xl mx-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="text-lg font-semibold text-gray-900">Submission Details</div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 rounded-md p-1"
                  aria-label="Close dialog"
                >
                  ×
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Student</div>
                    <div className="font-medium text-gray-900">{modalAssignment.user?.name || modalAssignment.userId}</div>
                    <div className="text-sm text-gray-500">{modalAssignment.user?.email || '—'}</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">Submitted</div>
                    <div className="text-sm text-gray-700">{modalAssignment.submittedAt ? new Date(modalAssignment.submittedAt).toLocaleString() : '—'}</div>
                    {modalAssignment.grade && (
                      <div className="text-xs text-gray-500 mt-2">Grade</div>
                    )}
                    {modalAssignment.grade && <div className="text-sm text-gray-700">{modalAssignment.grade}</div>}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Content</div>
                  <div className="mt-2 text-sm text-gray-700 break-words whitespace-pre-wrap">{modalAssignment.content || '—'}</div>
                </div>

                {modalAssignment.moduleId && (
                  <div className="text-xs text-gray-500">Module / Lesson</div>
                )}
                {modalAssignment.moduleId && (
                  <div className="text-sm text-gray-700">{modalAssignment.moduleId} {modalAssignment.lessonId ? `• Lesson: ${modalAssignment.lessonId}` : ''}</div>
                )}

                {modalAssignment.attachments && modalAssignment.attachments.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500">Attachments</div>
                    <div className="mt-2 space-y-2">
                      {modalAssignment.attachments.map((att, i) => (
                        <a key={i} href={att.url || att} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline block">{att.name || att.url || `Attachment ${i+1}`}</a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-3 border-t flex justify-end">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAssignments;
