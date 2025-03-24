const dbConnectAndRun = require('../utils/dbConnectAndRun');
const seedUsers = require('./userSeeder');

const runAllSeeders = async () => {
    await seedUsers();
    // Add more seeders here in future
};

// Run all seeders using dbConnectAndRun
dbConnectAndRun(runAllSeeders);
