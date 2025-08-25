import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <div
      className="bg-deep-black text-white min-h-screen font-sans relative overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 50% -30%, var(--color-electric-blue), var(--color-deep-black) 70%)',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      <Navbar />
      <main className="relative z-10 pt-24 container mx-auto px-6 pb-16">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardPage;