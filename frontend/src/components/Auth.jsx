import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
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
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Cannot connect to server');
    }
  };

  return (
    <div className="min-h-screen flex bg-lexi-bg font-sans text-lexi-text">
      {/* LEFT SIDE (40%) - Premium Purple Gradient */}
      <div className="hidden lg:flex w-[40%] relative overflow-hidden bg-gradient-sidebar flex-col justify-center px-16 shadow-[10px_0_30px_rgba(73,34,91,0.1)] z-10">
        {/* Subtle AI Particles / Circles */}
        <div className="absolute top-[-5%] left-[-10%] w-96 h-96 bg-white/5 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-80 h-80 bg-lexi-gold/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 text-white">
          <div className="text-4xl mb-4">🎧✨</div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">LexiSonic</h1>
          <h2 className="text-4xl font-bold leading-tight mb-6 opacity-90">Turn Every Book Into An Experience.</h2>
          <p className="text-white/70 text-lg font-medium">AI Narration • Smart Voices • Cloud Library</p>
        </div>
      </div>

      {/* RIGHT SIDE (60%) - White Clean Card */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-8 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-10 rounded-[24px] bg-white border border-lexi-border shadow-[0_8px_30px_rgba(73,34,91,0.08)]"
        >
          <h3 className="text-3xl font-extrabold text-lexi-text mb-2">{isLogin ? 'Welcome Back 👋' : 'Join LexiSonic ✨'}</h3>
          <p className="text-lexi-muted text-sm mb-8">{isLogin ? 'Login to continue your audiobook journey.' : 'Experience premium AI narration today.'}</p>

          {error && <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-lexi-muted mb-2">Full Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Vaishnavi Sharma" className="w-full bg-white border border-lexi-surface rounded-xl px-4 py-3 text-lexi-text focus:outline-none focus:border-lexi-secondary focus:ring-4 focus:ring-lexi-secondary/15 transition-all" />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-lexi-muted mb-2">Email Address</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="hello@example.com" className="w-full bg-white border border-lexi-surface rounded-xl px-4 py-3 text-lexi-text focus:outline-none focus:border-lexi-secondary focus:ring-4 focus:ring-lexi-secondary/15 transition-all" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-lexi-muted">Password</label>
                {isLogin && <button type="button" className="text-xs text-lexi-primary hover:text-lexi-secondary transition-colors font-semibold">Forgot Password?</button>}
              </div>
              <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="w-full bg-white border border-lexi-surface rounded-xl px-4 py-3 text-lexi-text focus:outline-none focus:border-lexi-secondary focus:ring-4 focus:ring-lexi-secondary/15 transition-all" />
            </div>

            {isLogin && (
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-lexi-surface text-lexi-primary focus:ring-lexi-primary/20 w-4 h-4" />
                <span className="text-sm text-lexi-muted font-medium">Remember me</span>
              </div>
            )}

            <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-primary hover:bg-gradient-hover text-white font-bold shadow-[0_4px_15px_rgba(110,52,130,0.25)] hover:shadow-[0_6px_20px_rgba(110,52,130,0.4)] hover:-translate-y-0.5 transition-all duration-300">
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px bg-lexi-border flex-1"></div>
            <span className="text-xs text-lexi-muted font-semibold uppercase tracking-wider">OR</span>
            <div className="h-px bg-lexi-border flex-1"></div>
          </div>

          <button className="mt-6 w-full py-3.5 rounded-xl bg-lexi-bg border border-lexi-border text-lexi-text font-semibold hover:bg-lexi-surface transition-colors flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-lexi-muted font-medium">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-lexi-primary hover:text-lexi-secondary transition-colors font-bold">
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}