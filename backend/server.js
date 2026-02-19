const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize the Database Connection
require('./config/db');

const app = express();

// Global Middleware
app.use(cors()); // Allows your React frontend to communicate with this API
app.use(express.json()); // Parses incoming JSON payloads

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const ownerRoutes = require('./routes/ownerRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/owner', ownerRoutes);

// Basic Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Store Rating API is running smoothly 🚀' });
});

// Global Error Handler (Fallback)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong on the server!' });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});