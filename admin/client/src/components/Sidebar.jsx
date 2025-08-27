import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4 flex-shrink-0">
      <div className="text-2xl font-bold mb-4">Spacey Mission</div>
      <nav>
        <ul>
          <li>
            <NavLink
              to="/dashboard/users"
              className={({ isActive }) =>
                `block py-2 px-4 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
              }
            >
              Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/lessons"
              className={({ isActive }) =>
                `block py-2 px-4 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
              }
            >
              Lessons
            </NavLink>
          </li>
          {/* You can add more navigation links here */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;