import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth'; // Import the useAuth hook
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../../../lib/firebase'; // Import the Firestore instance

const SignUpForm = () => {
  const { signup } = useAuth(); // Get the signup function from useAuth
  const navigate = useNavigate(); // Get the navigate function from react-router-dom

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(''); // State to hold error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);

    try {
      const userCredential = await signup(email, password);
      const user = userCredential.user;

      // Write a new document to the 'users' collection using the UID as the document ID
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: user.email,
        createdAt: serverTimestamp() // Use serverTimestamp for consistent timestamps
      });

      console.log('Signup successful:', user);
      navigate('/dashboard'); // Navigate to the dashboard after successful signup
    } catch (err) {
      console.error('Signup failed:', err);
      setError(err.message); // Display Firebase error message to the user
    } finally {
      setLoading(false);
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
          <h2 className="text-4xl font-bold text-cyan-green">Create Your Account ✨</h2>
          <p className="mt-2 text-white/70">
            Embark on your STEM adventure. 🚀
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="text-base font-bold text-gray-400 block mb-2">Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input id="name" name="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="w-full pl-10 pr-4 py-3 bg-deep-black/70 border border-white/20 rounded-md focus:ring-2 focus:ring-electric-blue focus:border-electric-blue outline-none transition text-base text-gray-200 placeholder:text-gray-500" />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="text-base font-bold text-gray-400 block mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full pl-10 pr-4 py-3 bg-deep-black/70 border border-white/20 rounded-md focus:ring-2 focus:ring-electric-blue focus:border-electric-blue outline-none transition text-base text-gray-200 placeholder:text-gray-500" />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="text-base font-bold text-gray-400 block mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-12 py-3 bg-deep-black/70 border border-white/20 rounded-md focus:ring-2 focus:ring-electric-blue focus:border-electric-blue outline-none transition text-base text-gray-200 placeholder:text-gray-500" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-base font-bold text-deep-black bg-electric-blue hover:bg-electric-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-deep-black focus:ring-electric-blue disabled:bg-gray-600 disabled:cursor-not-allowed transition animate-pulse-glow">
            {loading ? 'Creating Account...' : 'Continue'}
          </button>
        </form>

        <p className="text-base text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-cyan-400 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;