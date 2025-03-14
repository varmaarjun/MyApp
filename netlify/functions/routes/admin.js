const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const User = require('../models/user');

// Middleware to check if user is admin
const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Access denied');
    }
    next();
};

// Route to top up balance
router.post('/topup', authenticateToken, checkAdmin, async (req, res) => {
    const { playerId, amount } = req.body;

    try {
        const player = await User.findById(playerId);
        if (!player) {
            return res.status(404).send('Player not found');
        }

        player.balance += amount;
        await player.save();

        res.status(200).send('Balance topped up successfully');
    } catch (err) {
        console.error('Error topping up balance:', err);
        res.status(500).send('Error topping up balance: ' + err.message);
    }
});

module.exports = router;
