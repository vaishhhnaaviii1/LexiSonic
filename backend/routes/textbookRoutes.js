const express = require('express');
const router = express.Router();
const textbookController = require('../controllers/textbookController');

// 1. POST Request: Book save karne ke liye (Kal wala)
router.post('/', textbookController.uploadTextbook);

// 2. GET Request: Saari books lene ke liye
router.get('/', textbookController.getAllTextbooks);

// 3. GET Request: Ek specific book uski ID se lene ke liye
// Yahan ':id' ek variable (placeholder) ki tarah kaam karta hai
router.get('/:id', textbookController.getTextbookById);

// 4. GET Request: Book ka audio generate karne ke liye
router.get('/:id/audio', textbookController.generateAudioForTextbook);

module.exports = router;