const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

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

exports.handler = async (event, context) => {
  await connectDB(); // Ensure the database is connected

  const { httpMethod, headers, queryStringParameters } = event;

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

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      // Check if userId is provided
      if (!queryStringParameters || !queryStringParameters.userId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'userId query parameter is required' }),
        };
      }

      // Ensure the userId in the token matches the userId in the query parameters
      if (userId !== queryStringParameters.userId) {
        return {
          statusCode: 403,
          body: JSON.stringify({ message: 'Access denied. Invalid user ID.' }),
        };
      }

      // Fetch all users (excluding sensitive data)
      const users = await mongoose.model('User').find(
        {},
        'name balance matchesWins matchesLost momWins'
      ).sort({ balance: -1 });

      // Fetch the current user
      const currentUser = await mongoose.model('User').findById(
        queryStringParameters.userId,
        'name role'
      );

      if (!currentUser) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'User not found' }),
        };
      }

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