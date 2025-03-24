const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const dbConnectAndRun = require('../utils/dbConnectAndRun');

const users = [
    {
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        email: 'john@example.com',
        phone: '01711111111',
        role: 'user',
    },
    {
        firstName: 'Admin',
        lastName: 'User',
        password: 'admin123',
        email: 'admin@example.com',
        phone: '01722222222',
        role: 'admin',
    },
    {
        firstName: 'Jane',
        lastName: 'Smith',
        password: 'jane123',
        email: 'jane@example.com',
        phone: '01733333333',
        role: 'user',
    },
];

const seedUsers = async () => {
    try {
        await User.deleteMany();
        const hashedUsers = users.map((user) => ({
            ...user,
            password: bcrypt.hashSync(user.password, 10),
        }));

        await User.insertMany(hashedUsers);
        console.log('✅ Users Seeded Successfully');
    } catch (error) {
        console.error('❌ User Seeding Failed:', error);
    }
};

// Run this file directly for single seeding
if (require.main === module) {
    dbConnectAndRun(seedUsers);
}

module.exports = seedUsers;
