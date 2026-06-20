import React, { useContext, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const firstName = user?.name ? user.name.split(' ')[0] : 'Vaishnavi';
  
  // State variables
  const [extractedText, setExtractedText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [books, setBooks] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null); // Added for audio
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchBooks();
  }, [token]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/textbooks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) setBooks(response.data.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleScanPage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsExtracting(true);
    const formData = new FormData();
    formData.append('bookPage', file);
    try {
      const response = await axios.post('http://localhost:5000/api/ocr/extract', formData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) setExtractedText(response.data.text);
    } catch (error) {
      alert("Could not connect to OCR server.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveToDatabase = async () => {
    if (!extractedText.trim()) return alert("No text found to save!");
    try {
      const response = await axios.post('http://localhost:5000/api/textbooks', {
        title: "New Scanned Book",
        author: "Unknown Author",
        uploadedBy: user?.name || "Vaishnavi",
        rawText: extractedText,
        audioUrl: ""
      }, { headers: { 'Authorization': `Bearer ${token}` } });

      if (response.status === 201 || response.data.success) {
        alert("Success! Textbook saved.");
        fetchBooks();
      }
    } catch (error) {
      alert("Failed to save the textbook.");
    }
  };

  const handleGenerateAudio = async (bookId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/textbooks/${bookId}/audio`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setCurrentAudio(response.data.audioUrl);
        alert("Audio generated successfully!");
      }
    } catch (error) {
      alert("Failed to generate audio.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-24 relative">
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleScanPage} className="hidden" />

      {/* HEADER SECTION */}
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-extrabold text-lexi-text">Good Evening,<br/>{firstName} 👋</h2>
      </div>

      {/* AUDIO PLAYER */}
      {currentAudio && (
        <div className="bg-white p-4 rounded-2xl border border-lexi-surface shadow-sm">
          <h4 className="text-xs font-bold text-lexi-muted uppercase mb-2">Audio Player</h4>
          <audio controls src={currentAudio} className="w-full" />
        </div>
      )}

      {/* EXTRACTED TEXT EDITOR */}
      {(extractedText || isExtracting) && (
        <div className="bg-white border border-lexi-surface rounded-2xl p-6 shadow-sm">
          <textarea rows="6" value={extractedText} onChange={(e) => setExtractedText(e.target.value)} className="w-full bg-lexi-bg border border-lexi-surface rounded-xl p-4 text-sm"></textarea>
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={handleSaveToDatabase} className="px-6 py-2.5 bg-lexi-surface text-lexi-primary text-sm font-bold rounded-xl">💾 Save</button>
          </div>
        </div>
      )}

      {/* RECENT LIBRARY */}
      <div>
        <h3 className="text-xs font-bold text-lexi-muted uppercase tracking-widest mb-4">Recent Library</h3>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {books.map((book) => (
            <div key={book._id} className="w-40 flex-shrink-0 group">
              <div className="w-full h-40 bg-white border rounded-xl mb-2 flex items-center justify-center cursor-pointer" onClick={() => handleGenerateAudio(book._id)}>
                <span className="text-xs font-bold text-lexi-primary">🎧 Listen</span>
              </div>
              <h5 className="text-sm font-bold truncate">{book.title}</h5>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}