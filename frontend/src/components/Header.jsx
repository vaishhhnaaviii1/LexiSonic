import React from 'react';

function Header() {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950 flex items-center justify-between px-8 sticky top-0 z-10 shadow-md">
      {/* Search Input Box */}
      <div className="relative w-96">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs">🔍</span>
        <input 
          type="text" 
          placeholder="Search library or projects..." 
          className="w-full bg-slate-900 border border-slate-800 rounded-full pl-10 pr-4 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-slate-600"
        />
      </div>

      {/* Icons */}
      <div className="flex items-center gap-5 text-slate-400 text-sm">
        <button className="hover:text-slate-200 transition-colors">☀️</button>
        <button className="hover:text-slate-200 transition-colors relative">
          🔔
          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-300">
          V
        </div>
      </div>
    </header>
  );
}

export default Header;