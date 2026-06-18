// Hamare banaye huye Textbook Model ko import kar rahe hain
const googleTTS = require('google-tts-api');
const Textbook = require('../models/Textbook');

// 1. Nayi Textbook upload/save karne ka function
exports.uploadTextbook = async (req, res) => {
  try {
    // Frontend se jo data aayega (body mein), use nikal rahe hain
    const { title, author, uploadedBy, rawText, audioUrl } = req.body;

    // Model ka use karke database mein ek naya document bana rahe hain
    const newTextbook = new Textbook({
      title,
      author,
      uploadedBy,
      rawText,
      audioUrl
    });

    // `.save()` command database mein data ko permanently save kar degi
    const savedTextbook = await newTextbook.save();

    // Agar successfully save ho gaya, toh frontend ko 21 status code (Created) aur data bhej do
    res.status(201).json({
      success: true,
      message: 'Textbook successfully saved in database! 📚',
      data: savedTextbook
    });

  } catch (error) {
    // Agar koi galti hoti hai (jaise required field missing), toh error response bhejo
    res.status(500).json({
      success: false,
      message: 'Server error: Unable to save book.',
      error: error.message
    });
  }
};

// 2. SAARI TEXTBOOKS KI LIST GET KARNE KA FUNCTION
exports.getAllTextbooks = async (req, res) => {
  try {
    // .find() database se saare documents nikal kar ek array bana dega
    const textbooks = await Textbook.find().sort({ createdAt: -1 }); // -1 se nayi books sabse upar dikhengi
    
    res.status(200).json({
      success: true,
      count: textbooks.length,
      data: textbooks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Not able to fetch  books.',
      error: error.message
    });
  }
};

// 3. KISI EK SPECIFIC TEXTBOOK KA DATA ID SE NIKALNE KA FUNCTION
exports.getTextbookById = async (req, res) => {
  try {
    // req.params.id se hum URL ke andar bheji gayi ID ko read kar rahe hain
    const textbook = await Textbook.findById(req.params.id);

    // Agar us ID ki koi book database mein nahi milti
    if (!textbook) {
      return res.status(404).json({
        success: false,
        message: 'This textbook does not exist in our database. Please check the ID and try again.'
      });
    }

    // Agar mil gayi, toh response bhej do
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

// 4. TEXTBOOK TEXT KO AUDIO MEIN CONVERT KARNE KA FUNCTION (UPDATED)
exports.generateAudioForTextbook = async (req, res) => {
  try {
    const textbook = await Textbook.findById(req.params.id);
    
    if (!textbook) {
      return res.status(404).json({ success: false, message: 'Book nahi mili!' });
    }

    // Saaf text nikalte hain bina special characters ke
    const cleanText = textbook.rawText.substring(0, 200).replace(/[^a-zA-Z0-9 .,!?]/g, "");

    // NAYA TARIKA: Hum URL ke bajaye pure base64 audio data nikalenge
    const base64Audio = await googleTTS.getAudioBase64(cleanText, {
      lang: 'en',
      slow: false,
      host: 'https://translate.google.com',
      timeout: 10000,
    });

    // Frontend ko direct Data URI format mein bhejenge jo har player turant chala deta hai
    const audioDataUrl = `data:audio/mp3;base64,${base64Audio}`;

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