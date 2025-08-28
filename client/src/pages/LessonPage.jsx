import React from 'react';
import { useParams } from 'react-router-dom';

const LessonPage = () => {
  const { lessonId } = useParams();

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-8">
      <h1 className="text-4xl font-bold text-cyan-green mb-4">Lesson Page</h1>
      <p className="text-lg text-white/80">
        This is the page for lesson with ID: <span className="font-bold text-logo-yellow">{lessonId}</span>.
      </p>
      <p className="text-lg text-white/80 mt-4">Content for this lesson will be added here later.</p>
    </div>
  );
};

export default LessonPage;

