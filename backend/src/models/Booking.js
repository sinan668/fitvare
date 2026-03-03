const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        trainer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String, // e.g., "09:00 AM"
            required: true,
        },
        duration: {
            type: String,
            required: true,
        },
        sessionType: {
            type: String,
            required: true,
        },
        notes: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'confirmed', // For now, let's assume auto-confirm
        },
        totalPrice: {
            type: Number,
            required: true,
        }
    },
    { timestamps: true }
);

// Prevent overlapping bookings for the same trainer
bookingSchema.index({ trainer: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
