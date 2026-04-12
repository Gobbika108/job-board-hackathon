const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const authRoutes = require('./routes/auth');
const jobsRoutes = require('./routes/jobs');
const applicationsRoutes = require('./routes/applications');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded PDFs
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message || 'File upload failed' });
  }

  if (err) {
    return res.status(400).json({ message: err.message || 'Request failed' });
  }

  next();
});

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