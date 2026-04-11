const express = require('express');
const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/jobs - list all jobs with filters
router.get('/', async (req, res) => {
  try {
    const { category, location, type, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (location) query.location = location;
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(query)
      .populate('companyId', 'name')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/jobs/:id - single job with company name
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('companyId', 'name');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/jobs - create job (company only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Only companies can post jobs' });
    }

    const {
      title, description, requirements, location,
      type, category, stipend, deadline
    } = req.body;

    const job = new Job({
      companyId: req.user.userId,
      title,
      description,
      requirements,
      location,
      type,
      category,
      stipend,
      deadline
    });

    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/jobs/:id - delete job (company only, own jobs)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.companyId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete all applications for this job
    await Application.deleteMany({ jobId: req.params.id });
    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;