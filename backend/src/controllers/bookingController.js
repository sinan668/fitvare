const Booking = require('../models/Booking');
const TrainerProfile = require('../models/TrainerProfile');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Client)
exports.createBooking = async (req, res) => {
    try {
        const { trainerId, date, time, duration, sessionType, notes, totalPrice } = req.body;

        if (!trainerId || !date || !time || !duration || !sessionType || !totalPrice) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
        }

        // 1. Get Trainer Profile to check general availability
        const trainerProfile = await TrainerProfile.findOne({ user: trainerId });
        if (!trainerProfile) {
            return res.status(404).json({ success: false, message: 'Trainer not found.' });
        }

        // 2. Check if the day is open in trainer's availability
        const bookingDate = new Date(date);
        const dayOfWeek = bookingDate.toLocaleDateString('en-US', { weekday: 'long' });
        const dayAvailability = trainerProfile.availability.get(dayOfWeek);

        if (!dayAvailability || !dayAvailability.isOpen) {
            return res.status(400).json({
                success: false,
                message: `Trainer is not available on ${dayOfWeek}s.`
            });
        }

        // 3. Check for existing bookings (overlapping time)
        // For simplicity, we check exact date and time match first as requested
        const existingBooking = await Booking.findOne({
            trainer: trainerId,
            date: date,
            time: time,
            status: { $ne: 'cancelled' }
        });

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: 'there is no availabilty' // Matching user requirement exactly
            });
        }

        // 4. Create the booking
        const booking = await Booking.create({
            trainer: trainerId,
            client: req.user.id,
            date,
            time,
            duration,
            sessionType,
            notes,
            totalPrice
        });

        res.status(201).json({
            success: true,
            data: booking,
            message: 'Booking confirmed successfully!'
        });

    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get bookings for a trainer (for "Manage Availability" section)
// @route   GET /api/bookings/trainer/:trainerId
// @access  Private
exports.getTrainerBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            trainer: req.params.trainerId,
            status: { $ne: 'cancelled' }
        }).populate('client', 'name email');

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.error('Error fetching trainer bookings:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get bookings for the logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ client: req.user.id })
            .populate('trainer', 'name email')
            .sort('-date');

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
