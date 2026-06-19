import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const firstName = user?.name ? user.name.split(' ')[0] : 'Vaishnavi';

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-24">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-lexi-text mb-1">Good Evening,<br/>{firstName} 👋</h2>
          <p className="text-sm font-medium text-lexi-muted">Continue where you left off.</p>
        </div>
        <button className="px-6 py-3 rounded-xl bg-gradient-primary hover:bg-gradient-hover text-white text-sm font-bold shadow-[0_4px_15px_rgba(110,52,130,0.2)] hover:shadow-[0_6px_20px_rgba(110,52,130,0.3)] transition-all flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          New Audiobook
        </button>
      </div>

      {/* CONTINUE LISTENING HERO CARD */}
      <div>
        <h3 className="text-xs font-bold text-lexi-muted uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="text-lexi-gold text-lg">✨</span> Continue Listening
        </h3>
        <div className="bg-white hover:bg-lexi-card-hover border border-lexi-surface rounded-2xl p-6 shadow-[0_4px_20px_rgba(73,34,91,0.05)] hover:shadow-[0_8px_30px_rgba(73,34,91,0.08)] transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 group">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-inner">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div>
              <h4 className="text-xl font-extrabold text-lexi-text mb-2">Linear Algebra</h4>
              <div className="flex items-center gap-3">
                <div className="w-48 h-2 bg-lexi-surface rounded-full overflow-hidden">
                  <div className="h-full bg-lexi-gold w-[72%] rounded-full shadow-[0_0_10px_rgba(244,201,93,0.5)]"></div>
                </div>
                <span className="text-xs font-bold text-lexi-muted">72%</span>
              </div>
            </div>
          </div>
          
          <button className="w-12 h-12 rounded-full bg-lexi-surface text-lexi-primary flex items-center justify-center group-hover:bg-lexi-primary group-hover:text-white group-hover:shadow-[0_4px_15px_rgba(110,52,130,0.3)] transition-all shrink-0">
            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>
        </div>
      </div>

      {/* RECENT BOOKS & QUICK ACTIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RECENT BOOKS */}
        <div className="lg:col-span-2">
          <h3 className="text-xs font-bold text-lexi-muted uppercase tracking-widest mb-4">Recent Library</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {[1, 2, 3].map((item) => (
              <div key={item} className="w-40 flex-shrink-0 group cursor-pointer">
                <div className="w-full h-56 bg-white border border-lexi-surface shadow-sm rounded-xl mb-3 flex items-center justify-center group-hover:border-lexi-secondary group-hover:shadow-md transition-all relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-primary opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"></div>
                   <svg className="w-8 h-8 text-lexi-primary/40 group-hover:text-lexi-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <h5 className="text-sm font-bold text-lexi-text truncate group-hover:text-lexi-primary transition-colors">Project {item}</h5>
                <p className="text-xs font-medium text-lexi-muted">2 hours ago</p>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="lg:col-span-1">
          <h3 className="text-xs font-bold text-lexi-muted uppercase tracking-widest mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <button className="w-full p-4 rounded-xl bg-white border border-lexi-surface hover:border-lexi-secondary/50 hover:bg-lexi-card-hover shadow-sm hover:shadow-md transition-all flex items-center gap-3 text-sm font-bold text-lexi-text text-left">
              <div className="w-8 h-8 rounded-lg bg-lexi-surface text-lexi-primary flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              Generate AI Narration
            </button>
            <button className="w-full p-4 rounded-xl bg-white border border-lexi-surface hover:border-lexi-secondary/50 hover:bg-lexi-card-hover shadow-sm hover:shadow-md transition-all flex items-center gap-3 text-sm font-bold text-lexi-text text-left">
              <div className="w-8 h-8 rounded-lg bg-lexi-surface text-lexi-secondary flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              </div>
              Upload PDF File
            </button>
            <button className="w-full p-4 rounded-xl bg-white border border-lexi-surface hover:border-lexi-secondary/50 hover:bg-lexi-card-hover shadow-sm hover:shadow-md transition-all flex items-center gap-3 text-sm font-bold text-lexi-text text-left">
              <div className="w-8 h-8 rounded-lg bg-lexi-surface text-lexi-secondary flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
              </div>
              Import EPUB
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}