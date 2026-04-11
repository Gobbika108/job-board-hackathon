const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String, required: true },
  location: { type: String, enum: ['remote', 'onsite'], required: true },
  type: { type: String, enum: ['internship', 'part-time', 'full-time'], required: true },
  category: { type: String, enum: ['tech', 'marketing', 'design', 'finance'], required: true },
  stipend: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);