import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { createLesson, updateLesson } from '../features/lessons/api';
import LessonForm from '../features/lessons/components/LessonForm';

const LessonEditor = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!lessonId;

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchLesson = useCallback(async () => {
    if (!isEditing) return;
    try {
      setLoading(true);
      const docRef = doc(db, 'lessons', lessonId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLesson({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError('Lesson not found.');
      }
    } catch (err) {
      console.error("Error fetching lesson:", err);
      setError('Failed to fetch lesson data.');
    } finally {
      setLoading(false);
    }
  }, [lessonId, isEditing]);

  useEffect(() => {
    fetchLesson();
  }, [fetchLesson]);

  const handleSubmit = async (lessonData) => {
    setIsSaving(true);
    setError(null);
    try {
      if (isEditing) {
        await updateLesson(lessonId, lessonData);
      } else {
        await createLesson(lessonData);
      }
      navigate('/dashboard/lessons');
    } catch (err) {
      console.error("Error saving lesson:", err);
      setError(`Failed to save lesson: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div>Loading lesson editor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Lesson' : 'Create New Lesson'}</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      <LessonForm onSubmit={handleSubmit} onCancel={() => navigate('/dashboard/lessons')} initialData={lesson || {}} isSaving={isSaving} />
    </div>
  );
};

export default LessonEditor;