const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const router = express.Router();

// 1. Multer setup - Image ko RAM mein temporarily store karne ke liye
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 2. POST route jahan frontend image bhejega
router.post('/extract', upload.single('bookPage'), async (req, res) => {
  try {
    // Check agar file aayi hi nahi
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    console.log("Image received, starting OCR...");

    // 3. Tesseract Engine ko image dena aur text nikalna
    const { data: { text } } = await Tesseract.recognize(
      req.file.buffer, // Image ka data
      'eng'            // English language
    );

    console.log("OCR Complete!");

    // 4. Text wapas frontend ko bhej dena
    res.status(200).json({ success: true, text: text });

  } catch (error) {
    console.error("OCR Processing Error:", error);
    res.status(500).json({ success: false, message: 'Failed to extract text' });
  }
});

module.exports = router;