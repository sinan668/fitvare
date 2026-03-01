const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { register, login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// ================= NORMAL AUTH =================

// Public routes
router.post('/register', register);
router.post('/login', login);

// Private routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

// ================= GOOGLE AUTH =================

// Step 1: Redirect to Google
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Step 2: Google Callback
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
    }
);

module.exports = router;