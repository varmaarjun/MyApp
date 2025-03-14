const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const path = require('path');
const User = require('../models/user');

// Serve the dashboard.html file
router.get('/', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// API route to fetch user information and dashboard data
router.get('/data', authenticateToken, async (req, res) => {
    try {
        const users = await User.find({}, 'name balance matchesWins matchesLost momWins').sort({ balance: -1 });
        const currentUser = await User.findById(req.user.userId, 'name role'); // Include the role
        res.json({ users, currentUser });
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).send('Error fetching user data');
    }
});

module.exports = router;
