const mongoose = require('mongoose');

// 1. Blueprint (Schema) taiyar kar rahe hain
const TextbookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book ka title likhna zaroori hai!'], // Validation: iske bina save nahi hoga
    trim: true // Aage ya peeche ke faltu spaces automatic mita dega
  },
  author: {
    type: String,
    default: 'Unknown Author' // Agar user nahi daalta, toh automatic 'Unknown Author' set ho jayega
  },
  uploadedBy: {
    type: String,
    required: true
  },
  rawText: {
    type: String,
    required: [true, 'Textbook ka extracted text hona zaroori hai!']
  },
  audioUrl: {
    type: String, // Cloud storage ka URL hoga yahan
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now // Jab book create hogi, us waqt ka exact time automatic save ho jayega
  }
});

// 2. Schema se Model bana rahe hain aur export kar rahe hain
// 'Textbook' naam se MongoDB cloud mein automatic 'textbooks' (plural) naam ka collection ban jayega.
module.exports = mongoose.model('Textbook', TextbookSchema);