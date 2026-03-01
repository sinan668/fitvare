require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const errorHandler = require('./utils/errorHandler');
// Connect to MongoDB
connectDB();

const app = express();

require('./config/passport');
const passport = require('passport');

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true, // Allow cookies to be sent
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ message: '🚀 Fitvera Auth API is running', status: 'OK' });
});

app.use('/api/auth', authRoutes);
app.use('/api/trainers', trainerRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(
        `🚀 Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
    );
});
