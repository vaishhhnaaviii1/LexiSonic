import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // Form ke liye states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Catalog aur Audio ke liye naye states
  const [textbooks, setTextbooks] = useState([]);
  const [audioLoadingId, setAudioLoadingId] = useState(null);
  const [currentAudio, setCurrentAudio] = useState('');
  const [activeBookTitle, setActiveBookTitle] = useState('');

  // 1. Database se saari books fetch karne ka function
  const fetchTextbooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/textbooks');
      if (response.data.success) {
        setTextbooks(response.data.data);
      }
    } catch (error) {
      console.error("Unable to load books", error);
    }
  };

  // 2. useEffect: Page load hote hi automatic books fetch karega
  useEffect(() => {
    fetchTextbooks();
  }, []);

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('http://localhost:5000/api/textbooks', {
        title,
        author,
        uploadedBy: 'Vaishnavi',
        rawText
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Boom! Textbook successfully saved in database! 📚' });
        setTitle('');
        setAuthor('');
        setRawText('');
        fetchTextbooks(); // Nayi book upload hote hi catalog ko refresh karo!
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Server error: Unable to save book' });
    } finally {
      setLoading(false);
    }
  };

  // 3. Audio engine ko call karne ka function
  const handlePlayAudio = async (bookId, bookTitle) => {
    setAudioLoadingId(bookId);
    try {
      const response = await axios.get(`http://localhost:5000/api/textbooks/${bookId}/audio`);
      if (response.data.success) {
        setCurrentAudio(response.data.audioUrl);
        setActiveBookTitle(bookTitle);
      }
    } catch (error) {
      console.error("Error generating audio", error);
      alert("Unable to generate audio. Please try again later.");
    } finally {
      setAudioLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-10 px-4 pb-32">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-indigo-400 tracking-wide mb-2">LexiSonic Engine</h1>
        <p className="text-slate-400">Upload textbooks and convert them to speech instantly</p>
      </header>

      {/* Grid Layout: Left side Form, Right side Catalog */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: FORM (4 Cols) */}
        <div className="lg:col-span-5 bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">Add New Textbook</h2>
          
          {message.text && (
            <div className={`p-3 rounded-xl mb-4 text-xs font-medium ${
              message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Book Title *</label>
              <input 
                type="text" required placeholder="e.g. Real Analysis" value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Author Name</label>
              <input 
                type="text" placeholder="e.g. Robert G. Bartle" value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Text Content *</label>
              <textarea 
                required rows="5" placeholder="Paste textbook content here..." value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold py-2.5 rounded-xl transition-all text-sm">
              {loading ? 'Saving...' : 'Upload & Process 🚀'}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: TEXTBOOK CATALOG (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-2xl font-bold text-slate-200 mb-2">Your Textbook Library ({textbooks.length})</h2>
          
          {textbooks.length === 0 ? (
            <p className="text-slate-500 italic">No textbooks uploaded yet. Use the form on the left!</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto pr-2">
              {textbooks.map((book) => (
                <div key={book._id} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-md hover:border-slate-600 transition-all flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-indigo-300">{book.title}</h3>
                    <p className="text-xs text-slate-400 mb-2">By {book.author || 'Unknown Author'}</p>
                    <p className="text-sm text-slate-300 line-clamp-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800 italic">
                      "{book.rawText}"
                    </p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>Uploaded by: {book.uploadedBy}</span>
                    <button 
                      onClick={() => handlePlayAudio(book._id, book.title)}
                      disabled={audioLoadingId !== null}
                      className="bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 hover:text-white font-medium py-1.5 px-4 rounded-xl transition-all"
                    >
                      {audioLoadingId === book._id ? 'Generating Voice... 🎙️' : 'Listen Audio 🎧'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FIXED BOTTOM AUDIO PLAYER BAR */}
      {currentAudio && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-md border-t border-slate-700 py-4 px-6 flex flex-col md:flex-row items-center justify-between shadow-2xl z-50 animate-slide-up">
          <div className="mb-2 md:mb-0 text-center md:text-left">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Now Playing</p>
            <p className="text-sm font-bold text-slate-200">{activeBookTitle}</p>
          </div>
          <div className="w-full md:w-auto max-w-xl">
            <audio src={currentAudio} controls autoPlay className="w-full accent-indigo-500" />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;