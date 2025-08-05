const express = require('express');
const router = express.Router();
const spotController = require('../controllers/spotController.js');

// @route   GET api/spots
// @desc    Get all parking spots
// @access  Public
router.get('/', spotController.getAllSpots);

module.exports = router;