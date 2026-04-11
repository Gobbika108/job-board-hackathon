const express = require('express');
const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();


// ✅ GET /api/jobs - list all jobs with filters
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
    console.log(" GET JOBS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


// ✅ GET /api/jobs/:id - single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('companyId', 'name');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    console.log(" GET SINGLE JOB ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


// ✅ POST /api/jobs - create job (company only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log("👉 USER:", req.user); // DEBUG

    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Only companies can post jobs' });
    }

    const {
      title,
      description,
      requirements,
      location,
      type,
      category,
      stipend,
      deadline
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

    const savedJob = await job.save();

    res.status(201).json(savedJob);

  } catch (err) {
    console.log(" POST JOB ERROR:", err);  // 👈 IMPORTANT
    res.status(500).json({ message: err.message });  // 👈 SHOW REAL ERROR
  }
});


// ✅ DELETE /api/jobs/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.companyId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Application.deleteMany({ jobId: req.params.id });
    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: 'Job deleted' });

  } catch (err) {
    console.log(" DELETE JOB ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;