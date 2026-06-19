import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CreateAudiobook from './components/CreateAudiobook';
import AudioVisualizer from './AudioVisualizer';
import Auth from './components/Auth'; // <-- Auth component import kiya
import { AuthContext } from './context/AuthContext'; // <-- AuthContext import kiya

function App() {
  const { token, loading: authLoading } = useContext(AuthContext); // <-- Global login state nikal li
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [textbooks, setTextbooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [audioLoadingId, setAudioLoadingId] = useState(null);
  const [currentAudio, setCurrentAudio] = useState('');
  const [activeBookTitle, setActiveBookTitle] = useState('');
  const [isPlaying, setIsPlaying] = useState(false); 
  const [message, setMessage] = useState({ type: '', text: '' });

  const audioRef = useRef(null);

  // STEP 3 IMPLEMENTATION: Fetch data with JWT Header
  const fetchTextbooks = async () => {
    if (!token) return; // Agar logged in nahi hai toh fetch mat karo
    try {
      const response = await axios.get('http://localhost:5000/api/textbooks', {
        headers: { Authorization: `Bearer ${token}` } // <-- Headers pass kiya
      });
      if (response.data.success) setTextbooks(response.data.data);
    } catch (err) {
      console.error("Fetch layout error", err);
    }
  };

  useEffect(() => {
    fetchTextbooks();
  }, [token]); // Jab user login ho, tabhi fetch trigger ho

  // STEP 3 IMPLEMENTATION: Post data with JWT Header
  const handleUploadTextbook = async (formData) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await axios.post('http://localhost:5000/api/textbooks', 
        { ...formData }, // Note: 'uploadedBy' ab backend khud nikal lega token se!
        {
          headers: { Authorization: `Bearer ${token}` } // <-- Headers pass kiya
        }
      );
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Boom! Project saved to library! 📚' });
        fetchTextbooks();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to push data.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = async (bookId, bookTitle) => {
    if (activeBookTitle === bookTitle && currentAudio) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    setAudioLoadingId(bookId);
    try {
      // Audio stream api mein bhi secure header lagaya
      const response = await axios.get(`http://localhost:5000/api/textbooks/${bookId}/audio`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setCurrentAudio(response.data.audioUrl);
        setActiveBookTitle(bookTitle);
        setIsPlaying(true);
        
        if (audioRef.current) {
          audioRef.current.src = response.data.audioUrl;
          audioRef.current.play();
        }
      }
    } catch (error) {
      alert("Audio synthesizer trigger failed.");
    } finally {
      setAudioLoadingId(null);
    }
  };

  const toggleGlobalPlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // 1. Agar authentication loading chal rahi hai
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-bold">
        Loading LexiSonic Engine...
      </div>
    );
  }

  // 2. Agar user logged in nahi hai (Token nahi hai), toh pure dashboard ki jagah Login Screen dikhao
  if (!token) {
    return <Auth />;
  }

  // 3. User logged in hai, ab normal application layout render hoga
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex">
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 p-8 bg-[#F4F5F9] overflow-y-auto pb-32">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Create Audiobook</h2>
                <p className="text-xs text-slate-500">Convert text into immersive AI-generated narration.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 bg-white p-1 rounded-2xl shadow-sm border border-slate-200/60">
                  <CreateAudiobook onSubmit={handleUploadTextbook} loading={loading} message={message} />
                </div>

                <div className="lg:col-span-7 bg-slate-100/90 border border-slate-200 p-6 rounded-2xl shadow-inner space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-purple-700 uppercase tracking-wider">Library Items</h3>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md font-bold">
                      {textbooks.length} Total Projects
                    </span>
                  </div>
                  
                  {textbooks.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No textbooks loaded. Create one on the left!</p>
                  ) : (
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                      {textbooks.map((book) => {
                        const isThisBookActive = activeBookTitle === book.title;
                        return (
                          <div key={book._id} className="bg-white/80 border border-slate-200/50 p-4 rounded-xl flex items-center justify-between transition-all hover:bg-white hover:border-purple-300 hover:shadow-sm">
                            <div className="flex-1 min-w-0 pr-4">
                              <h4 className="text-sm font-bold text-slate-800 truncate">{book.title}</h4>
                              <p className="text-[10px] text-slate-500 truncate">By {book.author || 'Unknown Author'}</p>
                            </div>

                            <div className="flex items-center gap-4">
                              {currentAudio && isThisBookActive && isPlaying && (
                                <div className="bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                  <AudioVisualizer audioUrl={currentAudio} />
                                </div>
                              )}
                              <button 
                                onClick={() => handlePlayAudio(book._id, book.title)}
                                disabled={audioLoadingId !== null && audioLoadingId !== book._id}
                                className={`px-4 py-2 rounded-xl transition-all text-xs font-bold shadow-sm ${
                                  isThisBookActive && isPlaying 
                                    ? 'bg-amber-500 text-white hover:bg-amber-600' 
                                    : 'bg-purple-600 text-white hover:bg-purple-700'
                                }`}
                              >
                                {audioLoadingId === book._id 
                                  ? 'Loading...' 
                                  : (isThisBookActive && isPlaying ? 'Pause ⏸️' : 'Listen 🎧')
                                }
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'library' && (
            <div className="text-center text-xs text-slate-400 p-12 bg-slate-100 rounded-2xl border border-slate-200">
              Full repository catalog view streaming module active.
            </div>
          )}
        </main>
      </div>

      {currentAudio && (
        <div className="fixed bottom-4 left-72 right-8 bg-slate-950/80 backdrop-blur-lg border border-slate-800/80 py-4 px-8 flex items-center justify-between shadow-2xl rounded-2xl z-50 animate-slide-up text-white">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleGlobalPlayback}
              className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold hover:bg-purple-500 transition-all active:scale-95 shadow-md shadow-purple-600/30"
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <div>
              <p className="text-[9px] font-bold text-purple-400 uppercase tracking-widest animate-pulse">
                {isPlaying ? '● Streaming Synthesis' : 'Ⅱ Synthesizer Paused'}
              </p>
              <p className="text-sm font-bold text-slate-100">{activeBookTitle}</p>
            </div>
          </div>
          
          <div className="text-xs bg-purple-500/10 text-purple-400 px-5 py-2 rounded-full border border-purple-500/20 font-bold">
            🔊 Synthesizer Active
          </div>
        </div>
      )}
    </div>
  );
}

export default App;