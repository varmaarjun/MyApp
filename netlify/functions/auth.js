const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/user'); // Adjust the path to your User model
const mongoose = require('mongoose');


let isConnected = false;
const uri = "mongodb+srv://varmaarjun09:6oG1T53PIUYTIKe8@myapp.x2bd7.mongodb.net/cricketBettingDB?retryWrites=true&w=majority";
const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(uri, {
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
  
    const { httpMethod, body, path } = event;
    console.log('JWT_SECRET:', process.env.JWT_SECRET); // Debugging
  
    if (httpMethod === 'POST') {
      const { email, password, name } = JSON.parse(body);
  
      if (!email || !password) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Email and password are required' }),
        };
      }
  
      try {
        if (path.endsWith('/register')) {
          const existingUser = await mongoose.model('User').findOne({ email });
          if (existingUser) {
            return {
              statusCode: 400,
              body: JSON.stringify({ message: 'Email already registered' }),
            };
          }
  
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = new mongoose.model('User')({ name, email, password: hashedPassword });
          await newUser.save();
  
          return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User registered successfully' }),
          };
        } else if (path.endsWith('/login')) {
          const user = await mongoose.model('User').findOne({ email });
          if (!user || !(await bcrypt.compare(password, user.password))) {
            return {
              statusCode: 401,
              body: JSON.stringify({ message: 'Invalid email or password' }),
            };
          }
  
          const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
          return {
            statusCode: 200,
            body: JSON.stringify({ token }),
          };
        }
      } catch (err) {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Internal server error', error: err.message }),
        };
      }
    }
  
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  };