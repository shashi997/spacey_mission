import React from 'react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
     <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-8">
          <Outlet />
        </main>
      </div>
      <Sidebar />
    </div>
  );
};

export default Dashboard;

