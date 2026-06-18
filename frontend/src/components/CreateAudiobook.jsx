import React, { useState } from 'react';

function CreateAudiobook({ onSubmit, loading, message }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [rawText, setRawText] = useState('');

  const wordCount = rawText.trim() === '' ? 0 : rawText.trim().split(/\s+/).length;
  const estDurationMin = Math.ceil(wordCount / 130); 

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, author, rawText });
    setTitle('');
    setAuthor('');
    setRawText('');
  };

  return (
    <div className="bg-white p-5 w-full">
      {message?.text && (
        <div className={`p-3 rounded-xl mb-4 text-xs font-medium ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Script Content *</label>
          {/* UPDATED: Non-white, appealing background container */}
          <div className="bg-slate-100/80 border border-slate-200 rounded-xl p-4 transition-all focus-within:border-purple-400 focus-within:bg-white">
            <textarea 
              required rows="6" 
              placeholder="Paste your manuscript or write your story here..." 
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-700 focus:outline-none resize-none placeholder:text-slate-400 leading-relaxed"
            />
            
            <div className="flex gap-6 pt-4 border-t border-slate-200/60">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Words</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{wordCount}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Est. Duration</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{estDurationMin}m 0s</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Book Title *</label>
            <input 
              type="text" required placeholder="e.g. Real Analysis" value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-purple-400"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Author Name</label>
            <input 
              type="text" placeholder="e.g. Bartle" value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="submit" disabled={loading}
            className="px-6 py-2 w-full text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all shadow-md shadow-purple-600/20"
          >
            {loading ? 'Processing...' : 'Generate Audiobook ⚡'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateAudiobook;