const express = require('express');
const router = express.Router();
const User = require('../models/User'); // your User model
const Session = require('../models/Session'); // example Session model

// GET /api/dashboard - return dashboard summary data
router.get('/', async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();

    // Active sessions count (example)
    const activeSessions = await Session.countDocuments({ active: true });

    // Recent users joined (last 7 days)
    const recentUsers = await User.find({
      createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) }
    }).countDocuments();

    // You can add more stats here

    res.json({
      totalUsers,
      activeSessions,
      recentUsers,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
