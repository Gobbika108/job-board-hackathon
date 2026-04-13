const express = require('express');
const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();


// ✅ GET /api/jobs - list available jobs with filters
router.get('/', async (req, res) => {
  try {
    const { category, location, type, search, includeExpired } = req.query;
    
    const pipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'companyId',
          foreignField: '_id',
          as: 'companyData'
        }
      },
      {
        $unwind: '$companyData'
      }
    ];

    // Build match stage
    const matchStage = {};
    if (includeExpired !== 'true') {
      matchStage.deadline = { $gte: new Date() };
    }
    if (category) matchStage.category = category;
    if (location) matchStage.location = location;
    if (type) matchStage.type = type;

    if (search) {
      matchStage.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'companyData.name': { $regex: search, $options: 'i' } }
      ];
    }

    pipeline.push({ $match: matchStage });
    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        requirements: 1,
        location: 1,
        type: 1,
        category: 1,
        stipend: 1,
        deadline: 1,
        createdAt: 1,
        companyId: {
          _id: '$companyData._id',
          name: '$companyData.name'
        }
      }
    });

    const jobs = await Job.aggregate(pipeline);

    res.json(jobs);
  } catch (err) {
    console.log(" GET JOBS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET /api/jobs/mine - list jobs posted by the logged-in company
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Only companies can access their jobs' });
    }

    const jobs = await Job.find({ companyId: req.user.userId })
      .populate('companyId', 'name')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.log(' GET COMPANY JOBS ERROR:', err);
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