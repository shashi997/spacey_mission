import React from 'react';
import { useAuth } from '../features/authentication';
import { Link } from 'react-router-dom';
import { Rocket, BookOpen, BarChart3, Award, Settings } from 'lucide-react';

const DashboardIndexPage = () => {
  const { user } = useAuth();

  return (
    <div className="flex">
      {/* Sidebar (Rocket League style buttons) */}
      <div className="w-64 bg-black/60 p-4 flex flex-col gap-2">
        <Link
          to="my-lessons"
          className="flex items-center gap-3 px-4 py-3 text-lg font-bold text-white 
                     bg-gradient-to-r from-cyan-500/80 to-cyan-600/80 
                     hover:from-cyan-400 hover:to-cyan-500 
                     rounded-md shadow-lg transition-transform hover:translate-x-1"
        >
          <BookOpen size={22} />
          My Lessons
        </Link>

        <Link
          to="#"
          className="flex items-center gap-3 px-4 py-3 text-lg font-bold text-white 
                     bg-gradient-to-r from-sky-500/80 to-sky-600/80 
                     hover:from-sky-400 hover:to-sky-500 
                     rounded-md shadow-lg transition-transform hover:translate-x-1"
        >
          <BarChart3 size={22} />
          Progress & Stats
        </Link>

        <Link
          to="#"
          className="flex items-center gap-3 px-4 py-3 text-lg font-bold text-white 
                     bg-gradient-to-r from-yellow-400/80 to-yellow-500/80 
                     hover:from-yellow-300 hover:to-yellow-400 
                     rounded-md shadow-lg transition-transform hover:translate-x-1"
        >
          <Award size={22} />
          Badges & Awards
        </Link>

        <Link
          to="#"
          className="flex items-center gap-3 px-4 py-3 text-lg font-bold text-white 
                     bg-gradient-to-r from-gray-600/80 to-gray-700/80 
                     hover:from-gray-500 hover:to-gray-600 
                     rounded-md shadow-lg transition-transform hover:translate-x-1"
        >
          <Settings size={22} />
          Settings
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Welcome back, <span className="text-cyan-400">{user?.displayName || user?.email || 'Explorer'}</span>!
        </h1>
        <p className="text-lg text-white/80 mb-12">
          Ready to explore the solar system?
        </p>

        {/* Continue Lesson (Hero Section) */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
          <h2 className="text-3xl font-bold text-yellow-400 mb-4">Pick Up Where You Left Off</h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-6">
            Your last adventure was about the rings of Saturn. Let's continue!
          </p>
          <Link
            to="#"
            className="inline-flex items-center justify-center gap-3 bg-cyan-400 text-black font-bold px-8 py-4 rounded-full text-lg hover:scale-105 transition animate-pulse"
          >
            <Rocket size={22} />
            Continue Last Lesson
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardIndexPage;
