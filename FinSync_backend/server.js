require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sql = require('mssql');
const config = require('./config/dbConfig');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database connection
async function connectToDatabase() {
    try {
        console.log('Connecting to database...');
        await sql.connect(config);
        console.log('Database connected successfully!');
    } catch (error) {
        console.error('Database connection failed:', {
            message: error.message,
            code: error.code,
            state: error.state
        });
        process.exit(1);
    }
}

// Connect to database before starting server
connectToDatabase().then(() => {
    // Routes
    app.use('/api/users', userRoutes);

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error('Error:', err);
        res.status(500).json({ 
            message: 'Something went wrong!',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    });

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // Don't exit the process in production
    if (process.env.NODE_ENV === 'development') {
        process.exit(1);
    }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Don't exit the process in production
    if (process.env.NODE_ENV === 'development') {
        process.exit(1);
    }
});