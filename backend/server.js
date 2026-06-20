const cors = require('cors');
const authRoutes = require('./routes/auth');
const ocrRoutes = require('./routes/ocrRoutes');

//Hum 'express' library ko apne project mein include kar rahe hain taaki hum API bana sakein.
const express = require('express');

//Hum 'mongoose' library ko include kar rahe hain jo hamare Node.js code ko MongoDB se connect karegi.
const mongoose = require('mongoose');

//Yeh line hamari '.env' file ke secrets (jaise database password) ko read karne ke liye zaroori hai.
require('dotenv').config(); 

//Hum express ka ek instance (application) bana rahe hain jise hum 'app' kahenge.
const app = express();

//Yeh ek middleware hai jo hamare server ko batata hai ki agar frontend se koi JSON data aaye, toh use kaise samajhna hai.
app.use(express.json());
app.use(cors());// Yeh hamare frontend ko backend se connect hone ki permission dega
app.use('/api/auth', authRoutes);
app.use('/api/ocr', ocrRoutes);

//Hum '.env' file ke andar se MONGO_URI (connection string) ko nikal kar ek variable mein save kar rahe hain.
const mongoURI = process.env.MONGO_URI;

//Mongoose ki madad se hum cloud database se connect karne ki koshish kar rahe hain.
mongoose.connect(mongoURI)
  .then(() => {
    // Agar connection (successful) raha, toh yeh block chalega aur rocket emoji print hoga.
    console.log('Successfully connected to the MongoDB Cloud! 🚀');
  })
  .catch((error) => {
    // Agar koi (error) hui, jaise wrong password ya network issue, toh yeh block chalega aur error print karega.
    console.log('Database connection error dekho yahan:');
    console.error(error); 
  });

// Textbook ke routes ko import kiya
const textbookRoutes = require('./routes/textbookRoutes');

// JO AAPKA TEXTBOOK ROUTE THA, usme middleware apply kar do taaki koi bina login ke access na kare:
const authMiddleware = require('./middleware/authMiddleware');
app.use('/api/textbooks', authMiddleware, textbookRoutes);

// Express ko bataya ki jab bhi URL mein '/api/textbooks' aaye, toh textbookRoutes use karo
app.use('/api/textbooks', textbookRoutes);

//Yeh hamara base route hai. Jab aap browser mein http://localhost:5000/ kholenge, toh yeh message dikhega.
app.get('/', (req, res) => {
  res.send('LexiSonic Backend API is running successfully!');
});

// Hum batate hain ki hamara server kis port par chalega. Agar '.env' mein port nahi mila, toh default 5000 use hoga.
const PORT = process.env.PORT || 5000;

// Yeh line server ko officially start karti hai aur use port par active kar deti hai.
app.listen(PORT, () => {
  console.log(`Server is running happily on port ${PORT}`);
});