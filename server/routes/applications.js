const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const https = require('https');

const router = express.Router();

// Helper endpoint to serve PDFs inline instead of downloading
router.get('/resume/:fileId', (req, res) => {
  try {
    const cloudinaryUrl = Buffer.from(req.params.fileId, 'base64url').toString('utf-8');
    
    https.get(cloudinaryUrl, (pdfRes) => {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');
      pdfRes.pipe(res);
    }).on('error', (err) => {
      res.status(500).json({ message: 'Error fetching resume' });
    });
  } catch (err) {
    res.status(400).json({ message: 'Invalid resume link' });
  }
});

// POST /api/applications - apply to job (student only)
router.post('/', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can apply' });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF resume' });
    }

    const { jobId, coverNote } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check deadline
    if (new Date(job.deadline) < new Date()) {
      return res.status(400).json({ message: 'Application deadline passed' });
    }

    // Check if already applied
    const existingApp = await Application.findOne({ studentId: req.user.userId, jobId });
    if (existingApp) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    // Create application
    const application = new Application({
      studentId: req.user.userId,
      jobId,
      resumePath: req.file.path,
      coverNote
    });

    await application.save();
    res.status(201).json(application);
  } catch (err) {
    console.error('Application error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// GET /api/applications/mine - student's own applications
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can view their applications' });
    }

    const applications = await Application.find({ studentId: req.user.userId })
      .populate({
        path: 'jobId',
        populate: { path: 'companyId', select: 'name' }
      })
      .sort({ appliedAt: -1 });

    const applicationsWithProxyUrl = applications.map(app => ({
      ...app.toObject(),
      resumePath: `/api/applications/resume/${Buffer.from(app.resumePath).toString('base64url')}`
    }));

    res.json(applicationsWithProxyUrl);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/applications/job/:jobId - applicants for a job (company only)
router.get('/job/:jobId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Only companies can view applicants' });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.companyId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('studentId', 'name email')
      .sort({ appliedAt: -1 });

    const applicationsWithResumeLink = applications.map(app => ({
      ...app.toObject(),
      resumePath: `/api/applications/resume/${Buffer.from(app.resumePath).toString('base64url')}`,
      resumeUrl: `/api/applications/resume/${Buffer.from(app.resumePath).toString('base64url')}`
    }));

    res.json(applicationsWithResumeLink);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/applications/:id/status - update application status (company only)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Only companies can update status' });
    }

    const { status } = req.body;
    if (!['applied', 'under review', 'shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const job = await Job.findById(application.jobId);
    if (job.companyId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;