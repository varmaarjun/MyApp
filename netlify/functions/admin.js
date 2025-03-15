const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/user'); // Adjust the path to your User model

// Reuse the MongoDB connection
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

// Middleware to check if user is admin
const checkAdmin = (user) => {
    if (user.role !== 'admin') {
        throw new Error('Access denied');
    }
};

// Function to handle top-up requests
exports.handler = async (event, context) => {
    await connectDB(); // Ensure the database is connected

    const { httpMethod, headers, body } = event;

    console.log('Received event:', event); // Debugging

    if (httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method not allowed' }),
        };
    }

    try {
        // Authenticate the token
        const token = headers.authorization?.split(' ')[1];
        if (!token) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Access denied. No token provided.' }),
            };
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'User not found' }),
            };
        }

        // Check if the user is an admin
        checkAdmin(user);

        // Parse and validate the request body
        const { playerId, amount } = JSON.parse(body);

        if (!playerId || !amount) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'playerId and amount are required' }),
            };
        }

        if (typeof amount !== 'number' || amount <= 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Amount must be a positive number' }),
            };
        }

        // Find the player and update their balance
        const player = await User.findById(playerId);
        if (!player) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Player not found' }),
            };
        }

        player.balance += amount;
        await player.save();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Balance topped up successfully' }),
        };
    } catch (err) {
        console.error('Error:', err); // Debugging

        if (err.message === 'Access denied') {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Access denied' }),
            };
        }

        if (err.name === 'JsonWebTokenError') {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid token' }),
            };
        }

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error', error: err.message }),
        };
    }
};