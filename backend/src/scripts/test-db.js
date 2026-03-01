const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const testGenderField = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitvare');
        console.log('Connected to MongoDB');

        // Create a unique email
        const email = `test-${Date.now()}@example.com`;

        console.log(`Creating user with email: ${email} and gender: male`);

        const user = await User.create({
            name: 'Test User',
            email: email,
            password: 'password123',
            gender: 'male'
        });

        console.log('User created successfully:');
        console.log(JSON.stringify(user, null, 2));

        // Fetch from DB to be sure
        const foundUser = await User.findById(user._id);
        console.log('User fetched from DB:');
        console.log(JSON.stringify(foundUser, null, 2));

        if (foundUser.gender === 'male') {
            console.log('✅ SUCCESS: Gender field is present and correct.');
        } else {
            console.log('❌ FAILURE: Gender field is missing or incorrect.');
        }

        // Cleanup
        await User.findByIdAndDelete(user._id);
        console.log('Test user deleted.');

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error during test:', error);
        process.exit(1);
    }
};

testGenderField();
