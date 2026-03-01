const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await User.findOne({
                        $or: [
                            { googleId: profile.id },
                            { email: profile.emails[0].value }
                        ]
                    });

                    if (!user) {
                        user = await User.create({
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            googleId: profile.id,
                            gender: 'other', // Default gender for OAuth
                            role: 'client',
                            password: Math.random().toString(36).slice(-8)
                        });
                    } else if (!user.googleId) {
                        user.googleId = profile.id;
                        await user.save();
                    }

                    done(null, user);
                } catch (err) {
                    done(err, null);
                }
            }
        )
    );
} else {
    console.warn('⚠️ Google OAuth credentials missing. Google Login will be disabled.');
}

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});