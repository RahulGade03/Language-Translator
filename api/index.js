import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
const app = express();
const PORT = 8081;

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}`;


app.use(cors())
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


const translationSchema = new mongoose.Schema({
  originalText: String,
  translatedText: String,
  createdAt: { type: Date, default: Date.now },
});
const Translation = mongoose.model('Translation', translationSchema);

app.use(express.json());

app.post('/translations', async (req, res) => {
  try {
    const { originalText, translatedText } = req.body;
    const translation = new Translation({ originalText, translatedText });
    await translation.save();
    res.status(201).json({ message: 'Translation saved successfully' });
  } catch (error) {
    console.error('Error saving translation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/translations', async (req, res) => {
  try {
    console.log('request received');
    const translations = await Translation.find({}).sort('-createdAt'); // Sort by creation date, newest first
    console.log(translations);
    res.json(translations);
  } catch (error) {
    console.error('Error fetching translation history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


mongoose.connect(MONGODB_URI,{dbName:'translatorApp'}).then(()=>{
    console.log('connected to db')
      app.listen(PORT, () => {
          console.log(`Server is running on http://localhost:${PORT}`);
        });
  });
