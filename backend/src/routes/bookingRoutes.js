const express = require('express');
const router = express.Router();
const { createBooking, getTrainerBookings, getUserBookings } = require('../controllers/bookingController');
// Assuming protect middleware exists based on common patterns
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.get('/trainer/:trainerId', protect, getTrainerBookings);

module.exports = router;
