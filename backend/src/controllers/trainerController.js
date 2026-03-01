const TrainerProfile = require('../models/TrainerProfile');
const User = require('../models/User');

const jwt = require('jsonwebtoken');

exports.applyForTrainer = async (req, res) => {
    try {
        const { experience, bio, specializations, profileImage } = req.body;

        if (!experience || !bio || !specializations || specializations.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
        }

        const userId = req.user.id;

        // Check if trainer profile already exists
        let trainerProfile = await TrainerProfile.findOne({ user: userId });

        if (trainerProfile) {
            return res.status(400).json({ success: false, message: 'You have already applied or are already a trainer.' });
        }

        // Create new trainer profile
        trainerProfile = await TrainerProfile.create({
            user: userId,
            experience,
            bio,
            specializations,
            profileImage,
        });

        // Upgrade user role to trainer
        const updatedUser = await User.findByIdAndUpdate(userId, { role: 'trainer' }, { new: true });

        // Generate new token with updated role if needed, though usually just ID is in token.
        // But to keep auth in sync, let's sign a new token just in case and return the updated user.
        const token = jwt.sign(
            { id: updatedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            data: trainerProfile,
            user: updatedUser,
            token,
            message: 'Successfully applied and upgraded to Trainer!',
        });
    } catch (error) {
        console.error('Error applying for trainer:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};

exports.getTrainerProfile = async (req, res) => {
    try {
        const trainerProfile = await TrainerProfile.findOne({ user: req.user.id }).populate('user', 'name email gender');

        if (!trainerProfile) {
            return res.status(404).json({ success: false, message: 'Trainer profile not found.' });
        }

        res.status(200).json({
            success: true,
            data: trainerProfile,
        });
    } catch (error) {
        console.error('Error fetching trainer profile:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
