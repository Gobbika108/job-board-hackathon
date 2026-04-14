const express = require('express');
require('dotenv').config();
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

// Kept for backward compatibility for any old local file URLs.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

module.exports = app;