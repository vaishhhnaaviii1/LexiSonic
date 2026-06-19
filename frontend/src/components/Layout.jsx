import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Layout({ children }) {
  const { logout, user } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2) : 'VS';
  const displayName = user?.name || 'Vaishnavi Sharma';
  const displayEmail = user?.email || 'vaishnavi@example.com';
  
  const activeTab = 'dashboard';

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    },
    { 
      id: 'library', 
      label: 'Library', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
    },
    { 
      id: 'create', 
      label: 'Create Audiobook', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
    },
    { 
      id: 'favorites', 
      label: 'Favorites', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
    }
  ];

  return (
    <div className="min-h-screen bg-lexi-bg text-lexi-text font-sans flex">
      {/* SIDEBAR - Purple Gradient */}
      <aside className="w-64 bg-gradient-sidebar shadow-xl flex flex-col justify-between p-6 hidden md:flex text-white z-50">
        <div>
          <div className="mb-10 pl-2">
            <h1 className="text-2xl font-extrabold tracking-wide flex items-center gap-2">
              <span className="text-lexi-gold">🎧</span> LexiSonic
            </h1>
          </div>
          <nav className="space-y-1">
            {navItems.map(item => (
              <button key={item.id} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                activeTab === item.id 
                ? 'bg-white/20 backdrop-blur-[10px] font-bold shadow-sm' 
                : 'text-white/80 font-medium hover:bg-white/10 hover:text-white'
              }`}>
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* SIGN OUT */}
        <div className="border-t border-white/20 pt-4">
           <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Sign Out
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TOP NAVBAR - White Glass */}
        <header className="h-20 bg-white/75 backdrop-blur-[18px] border-b border-lexi-border flex items-center justify-between px-8 z-40">
          <div className="flex-1 max-w-md">
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lexi-muted text-sm group-focus-within:text-lexi-primary transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input type="text" placeholder="Search library..." className="w-full bg-white border border-lexi-surface rounded-full pl-11 pr-4 py-2.5 text-sm text-lexi-text focus:outline-none focus:border-lexi-secondary focus:ring-4 focus:ring-lexi-secondary/15 transition-all placeholder:text-lexi-muted" />
            </div>
          </div>

          <div className="flex items-center gap-6 relative">
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="w-10 h-10 rounded-full bg-lexi-primary border-2 border-lexi-surface flex items-center justify-center text-sm font-bold text-white hover:bg-lexi-secondary transition-colors shadow-sm">
                {initials}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-4 w-64 rounded-2xl bg-white border border-lexi-border shadow-xl p-2 z-50">
                  <div className="p-4 flex items-center gap-3 border-b border-lexi-surface mb-2">
                    <div className="w-10 h-10 rounded-full bg-lexi-primary flex items-center justify-center text-sm font-bold text-white">{initials}</div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-lexi-text truncate">{displayName}</p>
                      <p className="text-xs text-lexi-muted truncate">{displayEmail}</p>
                    </div>
                  </div>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-lexi-text font-medium hover:bg-lexi-surface rounded-xl transition-colors">Profile settings</button>
                  <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-danger/10 rounded-xl transition-colors font-semibold mt-1">Sign out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
}