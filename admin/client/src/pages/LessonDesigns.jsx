import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLessons } from '../features/lessons/api';

const LessonDesigns = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLessons = useCallback(async () => {
    try {
      setLoading(true);
      const lessonsData = await getLessons();
      setLessons(lessonsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching lessons:", err);
      setError("Failed to fetch lessons.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  if (loading) return <div>Loading lessons for design...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Lesson Design</h2>
        <p className="text-gray-600">Select a lesson to open the visual designer.</p>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="grid grid-cols-4 gap-4 font-bold border-b-2 pb-2 mb-2 text-gray-600">
          <div>Title</div>
          <div>Description</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        {lessons.length > 0 ? (lessons.map(lesson => (
          <div key={lesson.id} className="grid grid-cols-4 gap-4 border-b p-2 items-center hover:bg-gray-50">
            <div className="font-medium">{lesson.title}</div>
            <div className="text-sm text-gray-600 truncate">{lesson.shortDescription}</div>
            <div>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${lesson.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {lesson.status}
              </span>
            </div>
            <div className="flex gap-4">
              <button onClick={() => navigate(`/dashboard/lesson-designs/design/${lesson.id}`)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">Design Lesson</button>
            </div>
          </div>
        ))) : (<p className="text-center p-4">No lessons found. Create a lesson first to design it.</p>)}
      </div>
    </div>
  );
};

export default LessonDesigns;