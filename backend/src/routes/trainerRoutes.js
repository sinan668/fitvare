const express = require('express');
const router = express.Router();
const { applyForTrainer, getTrainerProfile } = require('../controllers/trainerController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/trainers/apply
// @desc    Apply to be a trainer and upgrade user role
// @access  Private
router.post('/apply', protect, applyForTrainer);

// @route   GET /api/trainers/me
// @desc    Get current user's trainer profile
// @access  Private 
router.get('/me', protect, getTrainerProfile);

module.exports = router;
