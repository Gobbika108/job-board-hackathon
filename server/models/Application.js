const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  resumePath: { type: String, required: true },
  coverNote: { type: String, required: true },
  status: { type: String, enum: ['applied', 'under review', 'shortlisted', 'rejected'], default: 'applied' },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);