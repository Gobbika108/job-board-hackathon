const mongoose = require('mongoose');
const app = require('../app');

const MONGO_URI = process.env.ATLAS_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/jobboard';

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (err) {
    return res.status(500).json({ message: 'Database connection failed' });
  }
};