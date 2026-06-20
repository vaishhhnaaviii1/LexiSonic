// Importing the required packages and our Textbook Model
const googleTTS = require('google-tts-api');
const Textbook = require('../models/Textbook');

// 1. FUNCTION TO UPLOAD/SAVE A NEW TEXTBOOK
exports.uploadTextbook = async (req, res) => {
  try {
    // Extracting data sent from the frontend (inside req.body)
    const { title, author, uploadedBy, rawText, audioUrl } = req.body;

    // --- ADDED VALIDATION CHECK ---
    // Checking if the required fields are empty before hitting the database
    if (!title || !rawText || !uploadedBy) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Title, rawText, and uploadedBy are required fields!'
      });
    }

    // Creating a new document using the model
    const newTextbook = new Textbook({
      title,
      author: author || 'Unknown Author', // Fallback if author is not provided
      uploadedBy,
      rawText,
      audioUrl
    });

    // The `.save()` command permanently saves the data into the MongoDB database
    const savedTextbook = await newTextbook.save();

    // If successfully saved, send a 201 status code (Created) along with the data
    res.status(201).json({
      success: true,
      message: 'Textbook successfully saved in database! 📚',
      data: savedTextbook
    });

  } catch (error) {
    // If an error occurs, send a 500 Server Error response
    res.status(500).json({
      success: false,
      message: 'Server error: Unable to save book.',
      error: error.message
    });
  }
};

// 2. FUNCTION TO FETCH THE LIST OF ALL TEXTBOOKS
exports.getAllTextbooks = async (req, res) => {
  try {
    // .find() fetches all documents and returns them as an array
    // .sort({ createdAt: -1 }) ensures the newest books appear at the top
    const textbooks = await Textbook.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: textbooks.length,
      data: textbooks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Not able to fetch books.',
      error: error.message
    });
  }
};

// 3. FUNCTION TO FETCH A SPECIFIC TEXTBOOK BY ITS ID
exports.getTextbookById = async (req, res) => {
  try {
    // Reading the ID passed in the URL using req.params.id
    const textbook = await Textbook.findById(req.params.id);

    // If no book matches that ID in the database
    if (!textbook) {
      return res.status(404).json({
        success: false,
        message: 'This textbook does not exist in our database. Please check the ID and try again.'
      });
    }

    // If found, send the data back as a response
    res.status(200).json({
      success: true,
      data: textbook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Not able to fetch the textbook.',
      error: error.message
    });
  }
};

// 4. FUNCTION TO CONVERT TEXTBOOK TEXT TO AUDIO (TTS)
exports.generateAudioForTextbook = async (req, res) => {
  try {
    // Find the textbook by ID first
    const textbook = await Textbook.findById(req.params.id);
    
    if (!textbook) {
      return res.status(404).json({ 
        success: false, 
        message: 'Textbook not found!' 
      });
    }

    // Cleaning the text: keeping only alphanumeric characters and basic punctuation
    // Also taking the first 200 characters to ensure quick generation during testing
    const cleanText = textbook.rawText.substring(0, 200).replace(/[^a-zA-Z0-9 .,!?]/g, "");

    // Generating base64 audio data using Google TTS API
    const base64Audio = await googleTTS.getAudioBase64(cleanText, {
      lang: 'en',
      slow: false,
      host: 'https://translate.google.com',
      timeout: 10000,
    });

    // Formatting as a Data URI so the frontend audio player can play it immediately
    const audioDataUrl = `data:audio/mp3;base64,${base64Audio}`;

    // Saving the generated audio URL back to the textbook document in MongoDB
    textbook.audioUrl = audioDataUrl;
    await textbook.save();

    res.status(200).json({
      success: true,
      message: 'Audio engine successfully generated speech! 🎧',
      audioUrl: audioDataUrl,
      bookTitle: textbook.title
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating audio.',
      error: error.message
    });
  }
};