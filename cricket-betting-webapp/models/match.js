const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    matchesWon: Number,
    matchesLost: Number,
    manOfTheMatch: Number
});

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;
