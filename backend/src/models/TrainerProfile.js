const mongoose = require('mongoose');

const trainerProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        experience: {
            type: Number,
            required: [true, 'Experience is required'],
        },
        bio: {
            type: String,
            required: [true, 'Bio is required'],
            trim: true,
        },
        specializations: {
            type: [String],
            required: [true, 'At least one specialization is required'],
        },
        verificationProof: {
            type: String,
            // Keeping it optional for now, could be a URL from an upload service
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        profileImage: {
            type: String,
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        availability: {
            type: Map,
            of: {
                isOpen: { type: Boolean, default: false },
                workingHours: {
                    start: { type: String, default: '09:00' },
                    end: { type: String, default: '17:00' }
                }
            },
            default: {
                'Monday': { isOpen: true, workingHours: { start: '09:00', end: '17:00' } },
                'Tuesday': { isOpen: true, workingHours: { start: '09:00', end: '17:00' } },
                'Wednesday': { isOpen: true, workingHours: { start: '09:00', end: '17:00' } },
                'Thursday': { isOpen: true, workingHours: { start: '09:00', end: '17:00' } },
                'Friday': { isOpen: true, workingHours: { start: '09:00', end: '17:00' } },
                'Saturday': { isOpen: false, workingHours: { start: '10:00', end: '14:00' } },
                'Sunday': { isOpen: false, workingHours: { start: '10:00', end: '14:00' } }
            }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('TrainerProfile', trainerProfileSchema);
