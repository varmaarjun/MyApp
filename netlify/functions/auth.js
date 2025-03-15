const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
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

exports.handler = async (event, context) => {
    await connectDB(); // Ensure the database is connected

    const { httpMethod, body, path } = event;

    console.log('Received event:', event); // Debugging

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
                // Validate name, email, and password
                if (!name) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ message: 'Name is required' }),
                    };
                }

                if (password.length < 8) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ message: 'Password must be at least 8 characters long' }),
                    };
                }

                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ message: 'Email already registered' }),
                    };
                }

                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const newUser = new User({ name, email, password: hashedPassword });
                await newUser.save();

                return {
                    statusCode: 201,
                    body: JSON.stringify({ message: 'User registered successfully' }),
                };
            } else if (path.endsWith('/login')) {
                // Find user by email
                const user = await User.findOne({ email });
                if (!user) {
                    return {
                        statusCode: 401,
                        body: JSON.stringify({ message: 'Invalid email or password.' }),
                    };
                }

                // Compare password
                const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
                if (!isPasswordValid) {
                    return {
                        statusCode: 401,
                        body: JSON.stringify({ message: 'Invalid email or password.' }),
                    };
                }

                // Generate JWT
                const token = jwt.sign(
                    { userId: user._id, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                return {
                    statusCode: 200,
                    body: JSON.stringify({ token }),
                };
            }
        } catch (err) {
            console.error('Error:', err); // Debugging

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
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method not allowed' }),
    };
};