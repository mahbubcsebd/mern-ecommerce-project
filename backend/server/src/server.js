const dbConnect = require('./config/db');
const app = require('./app');
const { PORT } = require('./config/env');

// Listening Server
app.listen(PORT, async () => {
    console.log(`server is listening at http://localhost:${PORT}`);
    await dbConnect();
});
