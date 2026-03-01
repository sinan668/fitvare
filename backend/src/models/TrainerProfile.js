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
    },
    { timestamps: true }
);

module.exports = mongoose.model('TrainerProfile', trainerProfileSchema);
