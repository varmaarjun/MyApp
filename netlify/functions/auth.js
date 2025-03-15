const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/user'); // Adjust the path to your User model

exports.handler = async (event, context) => {
  const { httpMethod, body } = event;

  if (httpMethod === 'POST') {
    const { email, password, name } = JSON.parse(body);

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email and password are required' }),
      };
    }

    try {
      if (event.path.includes('/register')) {
        // Registration logic
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Email already registered' }),
          };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        return {
          statusCode: 201,
          body: JSON.stringify({ message: 'User registered successfully' }),
        };
      } else if (event.path.includes('/login')) {
        // Login logic
        const user = await User.findOne({ email });
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