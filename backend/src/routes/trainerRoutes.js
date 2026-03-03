const express = require('express');
const router = express.Router();
const { applyForTrainer, getTrainerProfile, getAllTrainers, updateAvailability, getTrainerById } = require('../controllers/trainerController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/trainers
// @desc    Get all trainers
// @access  Public
router.get('/', getAllTrainers);

// @route   POST /api/trainers/apply
// @desc    Apply to be a trainer and upgrade user role
// @access  Private
router.post('/apply', protect, applyForTrainer);

// @route   GET /api/trainers/me
// @desc    Get current user's trainer profile
// @access  Private 
router.get('/me', protect, getTrainerProfile);

// @route   GET /api/trainers/:id
// @desc    Get specific trainer profile
// @access  Public
router.get('/:id', getTrainerById);

// @route   PUT /api/trainers/availability
// @desc    Update trainer availability
// @access  Private
router.put('/availability', protect, updateAvailability);

module.exports = router;
