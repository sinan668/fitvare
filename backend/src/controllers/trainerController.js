const TrainerProfile = require('../models/TrainerProfile');
const User = require('../models/User');

const jwt = require('jsonwebtoken');

exports.applyForTrainer = async (req, res) => {
    try {
        const { experience, bio, specializations, profileImage, location } = req.body;

        if (!experience || !bio || !specializations || !location || specializations.length === 0) {
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
            location,
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
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                gender: updatedUser.gender,
            },
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

exports.getAllTrainers = async (req, res) => {
    try {
        const trainers = await TrainerProfile.find().populate('user', 'name email gender');

        res.status(200).json({
            success: true,
            count: trainers.length,
            data: trainers,
        });
    } catch (error) {
        console.error('Error fetching all trainers:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateAvailability = async (req, res) => {
    try {
        const { availability } = req.body;

        if (!availability) {
            return res.status(400).json({ success: false, message: 'Please provide availability data.' });
        }

        const trainerProfile = await TrainerProfile.findOneAndUpdate(
            { user: req.user.id },
            { availability },
            { new: true, runValidators: true }
        );

        if (!trainerProfile) {
            return res.status(404).json({ success: false, message: 'Trainer profile not found.' });
        }

        res.status(200).json({
            success: true,
            data: trainerProfile,
            message: 'Availability updated successfully!'
        });
    } catch (error) {
        console.error('Error updating availability:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getTrainerById = async (req, res) => {
    try {
        const trainer = await TrainerProfile.findOne({ user: req.params.id }).populate('user', 'name email gender');

        if (!trainer) {
            return res.status(404).json({ success: false, message: 'Trainer not found.' });
        }

        res.status(200).json({
            success: true,
            data: trainer
        });
    } catch (error) {
        console.error('Error fetching trainer by ID:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
