import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../features/authentication/hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const dropdownRef = useRef(null);

  const handleLoginClick = () => navigate('/login');
  const handleTryAppClick = () => navigate('/signup');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Navigate to home page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Close the dropdown if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const renderAuthSection = () => {
    // While the auth state is being determined, render a placeholder
    // to prevent the UI from flickering between logged-out and logged-in states.
    if (isLoading) {
      return <div className="h-10 w-48" />; // Placeholder with similar size to buttons
    }

    if (user) {
      // User is logged in
      return (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 hover:text-cyan-green transition text-sm focus:outline-none"
            title={user.displayName || user.email}
          >
            <User size={20} />
            <span className="hidden sm:inline truncate max-w-[150px]">{user.displayName || user.email}</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-deep-black border border-white/10 rounded-md shadow-lg z-20">
              <div className="p-2">
                <div className="px-2 py-2">
                  <p className="text-sm text-white">Signed in as</p>
                  <p className="text-sm font-medium text-cyan-green truncate" title={user.email || ''}>
                    {user.email}
                  </p>
                </div>
                <div className="border-t border-white/10 my-1"></div>
                <Link
                  to="/dashboard"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-electric-blue hover:text-deep-black transition rounded-md"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-electric-blue hover:text-deep-black transition rounded-md"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    // User is logged out
    return (
      <div className="flex space-x-4">
        <button
          onClick={handleLoginClick}
          className="px-4 py-2 font-semibold hover:text-cyan-green transition flex items-center gap-2"
        >
          <LogIn size={16} />
          Login
        </button>
        <button
          onClick={handleTryAppClick}
          className="bg-logo-yellow text-deep-black font-bold px-5 py-2 rounded-lg shadow-lg hover:shadow-yellow-400/50 transition animate-yellow-glow"
        >
          Try the App
        </button>
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-deep-black/80 border-b border-white/10">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center text-xl font-bold"><span className="text-cyan-green">Spacey</span><span className="text-electric-blue">Tutor</span></Link>
        <div className="hidden md:flex space-x-8 text-sm"><a href="/#features" className="hover:text-cyan-green transition">Features</a><a href="/#about" className="hover:text-electric-blue transition">About Us</a><a href="#contact" className="hover:text-logo-yellow transition">Contact</a></div>
        {renderAuthSection()}
      </nav>
    </header>
  );
};

export default Navbar;

