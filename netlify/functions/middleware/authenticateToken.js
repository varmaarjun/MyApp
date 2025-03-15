const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');

    // Check if Authorization header is present and starts with 'Bearer'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided or invalid token format.' });
    }

    // Extract the token from the header
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token using the JWT secret from environment variables
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach the decoded user data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('Token verification error:', err); // Log the error for debugging

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Access denied. Token has expired.' });
        }

        if (err.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Invalid token.' });
        }

        // Handle other errors
        return res.status(500).json({ message: 'Internal server error during token verification.' });
    }
};

module.exports = authenticateToken;