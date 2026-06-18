import React from 'react';

function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'library', label: 'Library', icon: '📚' },
    { id: 'create', label: 'Create Audiobook', icon: '✍️' },
    { id: 'favorites', label: 'Favorites', icon: '❤️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col justify-between p-6 fixed h-full left-0 top-0 z-20 text-slate-300">
      <div>
        {/* Brand Logo */}
        <div className="mb-10 pl-2">
          <h1 className="text-2xl font-bold text-purple-400 tracking-wide">LexiSonic</h1>
          <p className="text-xs text-slate-500 font-medium">Premium AI Audio</p>
        </div>

        {/* Purple New Project Button */}
        <button 
          onClick={() => setActiveTab('create')}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 mb-8 text-sm"
        >
          <span>+</span> New Project
        </button>

        <nav className="space-y-1.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.id
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Area: Sign Out + Profile */}
      <div className="pt-4 border-t border-slate-900 space-y-4">
        {/* Static Sign Out Option */}
        <button 
          onClick={() => alert("Sign out mechanism placeholder triggered.")}
          className="w-full flex items-center gap-4 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-all"
        >
          <span>🚪</span> Sign Out
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-sm">
            VS
          </div>
          <div>
            <p className="text-xs font-bold text-slate-300">Vaishnavi Sharma</p>
            <p className="text-[10px] text-slate-500">Developer Account</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;