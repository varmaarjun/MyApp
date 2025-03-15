const mongoose = require('mongoose');

// Use environment variable for MongoDB URI
const uri = process.env.MONGODB_URI;

// Options for MongoDB connection
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// Track connection state
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('MongoDB is already connected.');
        return;
    }

    try {
        await mongoose.connect(uri, options);
        isConnected = true;
        console.log('MongoDB connected successfully to MongoDB Atlas!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);

        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
            console.log('Attempting to reconnect to MongoDB...');
            connectDB();
        }, 5000);
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB.');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB.');
    isConnected = false;
});

// Handle process termination
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to application termination.');
    process.exit(0);
});

module.exports = connectDB;