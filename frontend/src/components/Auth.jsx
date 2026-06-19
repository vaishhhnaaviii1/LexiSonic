import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        login(data.token, data.user);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Cannot connect to server');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-xl backdrop-blur-md">
        <h2 className="text-center text-3xl font-bold tracking-tight text-white">
          {isLogin ? 'Welcome Back to LexiSonic' : 'Create Your Account'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          {isLogin ? 'Enter your credentials to access audiobooks' : 'Get started with high-fidelity text-to-speech'}
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="text-sm font-medium text-slate-300">Full Name</label>
              <input
                type="text"
                required
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                placeholder="Vaishnavi Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-slate-300">Email Address</label>
            <input
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              required
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-purple-600 p-3 font-semibold text-white transition hover:bg-purple-700 shadow-lg shadow-purple-600/20"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-purple-400 hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}