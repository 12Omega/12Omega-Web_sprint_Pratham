// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path if needed

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    // Create a new user instance with data from the request body
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    // Save the user document to MongoDB
    const savedUser = await newUser.save();

    // Return the saved user (you may want to exclude password in production)
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'User registration failed', error: error.message });
  }
});

module.exports = router;


