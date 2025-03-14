const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const Squad = require('../models/squad');
const User = require('../models/user');

// Fetch all squads
router.get('/data', authenticateToken, async (req, res) => {
  try {
    const squads = await Squad.find({});
    console.log('Squads:', squads); // Log squad data to verify
    res.status(200).json(squads);
  } catch (err) {
    console.error('Error fetching squad data:', err);
    res.status(500).send('Error fetching squad data');
  }
});

// Add a new squad
router.post('/add', authenticateToken, async (req, res) => {
  const { team, players } = req.body;
  try {
    const squad = new Squad({ team, players });
    await squad.save();
    res.status(201).send('Squad added successfully');
  } catch (err) {
    console.error('Error adding squad:', err);
    res.status(500).send('Error adding squad');
  }
});

module.exports = router;
