const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');

// MongoDB Atlas connection - set your ATLAS_URI in .env or use local MongoDB
// Example Atlas URI: mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/jobboard?retryWrites=true&w=majority
const MONGO_URI = process.env.ATLAS_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/jobboard';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log('Connected to MongoDB');

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

startServer();