const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize the app
const app = express();

// Middleware to parse JSON request body
app.use(express.json());

// Define routes
const authRoutes = require('./routes/authRoutes');  // Assuming your route file is in the 'routes' folder
app.use('/api', authRoutes);  // Register the auth routes with the /api prefix

// Default route (for testing)
app.get('/', (req, res) => {
    res.send('Server is running');
});


const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please free it or use another port.`);
        process.exit(1);
    }
});
