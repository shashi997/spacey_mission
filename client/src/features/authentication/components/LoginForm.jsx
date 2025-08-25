import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const LoginForm = () => {
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResetMessage('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setError('');
    setResetMessage('');
    if (!email) {
      setError('Please enter your email address to reset your password.');
      return;
    }
    try {
      await resetPassword(email);
      setResetMessage('Password reset email sent. Please check your inbox.');
    } catch (err) {
      console.error('Password reset failed:', err);
      // To prevent email enumeration, show a generic message.
      if (err.code === 'auth/user-not-found') {
        setResetMessage('Password reset email sent. Please check your inbox.');
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-deep-black text-white font-sans p-4"
      style={{
        background:
          'radial-gradient(circle at 50% 50%, var(--color-deep-black), #000 90%)',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative z-10 w-full max-w-md p-8 space-y-8 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-cyan-green">Welcome Back! 👋</h2>
          <p className="mt-2 text-white/70">
            Log in to continue your space mission. 🚀
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-base font-bold text-gray-400 block mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-3 bg-deep-black/70 border border-white/20 rounded-md focus:ring-2 focus:ring-electric-blue focus:border-electric-blue outline-none transition text-base text-gray-200 placeholder:text-gray-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="text-base font-bold text-gray-400 block">Password</label>
              <button
                type="button"
                onClick={handlePasswordReset}
                className="text-sm font-medium text-cyan-400 hover:underline focus:outline-none"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 bg-deep-black/70 border border-white/20 rounded-md focus:ring-2 focus:ring-electric-blue focus:border-electric-blue outline-none transition text-base text-gray-200 placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          {resetMessage && (
            <p className="text-green-400 text-sm text-center">{resetMessage}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-base font-bold text-deep-black bg-electric-blue hover:bg-electric-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-deep-black focus:ring-electric-blue disabled:bg-gray-600 disabled:cursor-not-allowed transition animate-pulse-glow"
          >
            {loading ? 'Logging In...' : 'Continue'}
          </button>
        </form>

        <p className="text-base text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-cyan-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;