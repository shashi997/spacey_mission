import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLessons, deleteLesson } from '../features/lessons/api';

const Lessons = () => {
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

  const handleDelete = async (lessonId) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        await deleteLesson(lessonId);
        fetchLessons(); // Refresh the list
      } catch (err) {
        console.error("Error deleting lesson:", err);
        setError("Failed to delete lesson.");
      }
    }
  };

  if (loading) return <div>Loading lessons...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Lessons</h2>
        <button
          onClick={() => navigate('/dashboard/lessons/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Lesson
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="grid grid-cols-5 gap-4 font-bold border-b-2 pb-2 mb-2 text-gray-600">
          <div>Title</div>
          <div>Description</div>
          <div>Duration</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        {lessons.length > 0 ? (lessons.map(lesson => (<div key={lesson.id} className="grid grid-cols-5 gap-4 border-b p-2 items-center hover:bg-gray-50">
          <div className="font-medium">{lesson.title}</div>
          <div className="text-sm text-gray-600 truncate">{lesson.shortDescription}</div>
          <div>{lesson.estimatedDuration}</div>
          <div><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${lesson.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{lesson.status}</span></div>
          <div className="flex gap-4"><button onClick={() => navigate(`/dashboard/lessons/edit/${lesson.id}`)} className="text-indigo-600 hover:text-indigo-900 font-medium">Edit</button><button onClick={() => handleDelete(lesson.id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button></div>
        </div>))) : (<p className="text-center p-4">No lessons found. Add one to get started!</p>)}
      </div>
    </div>);
};

export default Lessons;