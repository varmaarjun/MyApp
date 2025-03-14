const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const Match = require('../models/match');

router.get('/mis', authenticateToken, (req, res) => {
    Match.find({}, (err, matches) => {
        if (err) {
            res.send(err);
        } else {
            res.json(matches);
        }
    });
});

module.exports = router;
