const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1); // Exit if connection fails
    }
};

// Handle Unexpected Disconnects
mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB Disconnected! Retrying...');
    dbConnect();
});

module.exports = dbConnect;
