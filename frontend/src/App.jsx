import React, { useState } from 'react';
import axios from 'axios';

function App() {
  // Form fields ke liye React States
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Backend API call using Axios
      const response = await axios.post('http://localhost:5000/api/textbooks', {
        title,
        author,
        uploadedBy: 'Vaishnavi', // Abhi ke liye hardcoded user
        rawText
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Boom! Textbook successfully saved in database! 📚' });
        // Fields clear kar dete hain
        setTitle('');
        setAuthor('');
        setRawText('');
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Unable to connect to the server. Please try again later.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-10 px-4">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-indigo-400 tracking-wide mb-2">LexiSonic Engine</h1>
        <p className="text-slate-400">Upload textbooks and convert them to speech instantly</p>
      </header>

      {/* Main Form Container */}
      <div className="w-full max-w-2xl bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
        <h2 className="text-2xl font-semibold mb-6 text-indigo-300">Add New Textbook</h2>

        {/* Status Alert Messages */}
        {message.text && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${
            message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Book Title *</label>
            <input 
              type="text"
              required
              placeholder="e.g. Introduction to Real Analysis"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Author Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Author Name</label>
            <input 
              type="text"
              placeholder="e.g. Robert G. Bartle"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Raw Text Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Extracted Textbook Text (OCR Raw Text) *</label>
            <textarea 
              required
              rows="6"
              placeholder="Paste the extracted textbook chapters content here..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            {loading ? 'Saving to Database...' : 'Upload & Process Textbook 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;