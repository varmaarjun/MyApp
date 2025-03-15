const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

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

exports.handler = async (event, context) => {
    await connectDB(); // Ensure the database is connected

    const { httpMethod, headers } = event;

    console.log('Received event:', event); // Debugging

    if (httpMethod === 'GET') {
        try {
            // Authenticate the token
            const token = headers.authorization?.split(' ')[1];
            if (!token) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ message: 'Access denied. No token provided.' }),
                };
            }

            console.log('Token:', token); // Debugging

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded); // Debugging

            const currentUser = await User.findById(decoded.userId, 'name role');
            console.log('Current user:', currentUser); // Debugging

            if (!currentUser) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: 'User not found' }),
                };
            }

            // Fetch all users (excluding sensitive data)
            const users = await User.find({}, 'name balance matchesWins matchesLost momWins').sort({ balance: -1 });
            console.log('Users:', users); // Debugging

            return {
                statusCode: 200,
                body: JSON.stringify({ users, currentUser }),
            };
        } catch (err) {
            console.error('Error fetching user data:', err); // Debugging

            if (err.name === 'JsonWebTokenError') {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ message: 'Invalid token' }),
                };
            }

            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Error fetching user data', error: err.message }),
            };
        }
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method not allowed' }),
    };
};