const mongoose = require('mongoose');
const matchSchema = new mongoose.Schema({
  date: String,
  match: String,
  team1: String,
  team2: String,
  venue: String,
  time: String,
  selectedTeam: String,
  mom: String,
  result: String,
  momWinner: String  // Add this field
});
const Match = mongoose.model('Match', matchSchema);
module.exports = Match;
