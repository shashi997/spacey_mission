import React from 'react';

const MyLessonsPage = () => {
  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-8">
      <h1 className="text-4xl font-bold text-cyan-green mb-4">My Lessons</h1>
      <p className="text-lg text-white/80">Here you'll find all your past and current lessons.</p>
      {/* Future content for lessons will go here */}
    </div>
  );
};

export default MyLessonsPage;