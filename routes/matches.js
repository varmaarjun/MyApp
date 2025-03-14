const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const Match = require('../models/match');
const User = require('../models/user');
const Squad = require('../models/squad');

// Fetch match schedule data along with squad data
router.get('/data', authenticateToken, async (req, res) => {
    try {
      const matches = await Match.find({});
      const squads = await Squad.find({});
      console.log('Matches:', matches); // Log matches data to verify
      console.log('Squads:', squads); // Log squads data to verify
      res.status(200).json({ matches, squads }); // Send matches and squads as JSON response
    } catch (err) {
      console.error('Error fetching match data:', err);
      res.status(500).send('Error fetching match data');
    }
  });

// Update match results, MoM, selected team, and MoM Winner
router.post('/update', authenticateToken, async (req, res) => {
  const { index, selectedTeam, mom, result, momWinner } = req.body;
  try {
    const match = await Match.findById(index);
    if (!match) {
      return res.status(404).send('Match not found');
    }

    match.selectedTeam = selectedTeam;
    match.mom = mom;
    match.result = result;
    match.momWinner = momWinner;

    await match.save();
    res.status(200).send('Match updated successfully');
  } catch (err) {
    console.error('Error updating match:', err);
    res.status(500).send('Error updating match');
  }
});

module.exports = router;
