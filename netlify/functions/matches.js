const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Match = require('./models/match'); // Adjust the path to your Match model

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

exports.handler = async (event, context) => {
  await connectDB(); // Ensure the database is connected

  const { httpMethod, headers, body } = event;

  console.log('Received event:', event); // Debugging

  if (httpMethod === 'GET') {
    try {
      const matches = await Match.find({});
      return {
        statusCode: 200,
        body: JSON.stringify(matches),
      };
    } catch (err) {
      console.error('Error fetching match data:', err); // Debugging
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching match data', error: err.message }),
      };
    }
  } else if (httpMethod === 'POST') {
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
      const user = await mongoose.model('User').findById(decoded.userId);

      if (!user) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'User not found' }),
        };
      }

      // Check if the user is an admin for certain operations
      const { index, selectedTeam, mom, result, momWinner } = JSON.parse(body);

      if (result || momWinner) {
        checkAdmin(user); // Only admins can update result or MoM winner
      }

      const match = await Match.findById(index);
      if (!match) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Match not found' }),
        };
      }

      // Update match data
      if (selectedTeam) match.selectedTeam = selectedTeam;
      if (mom) match.mom = mom;
      if (result) match.result = result;
      if (momWinner) match.momWinner = momWinner;

      await match.save();

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Match updated successfully' }),
      };
    } catch (err) {
      console.error('Error updating match:', err); // Debugging

      if (err.message === 'Access denied') {
        return {
          statusCode: 403,
          body: JSON.stringify({ message: 'Access denied' }),
        };
      }

      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error updating match', error: err.message }),
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: 'Method not allowed' }),
  };
};