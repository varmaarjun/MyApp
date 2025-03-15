const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  date: {
    type: String,
    required: [true, 'Date is required'],
    trim: true,
  },
  match: {
    type: String,
    required: [true, 'Match name is required'],
    trim: true,
  },
  team1: {
    type: String,
    required: [true, 'Team 1 is required'],
    trim: true,
  },
  team2: {
    type: String,
    required: [true, 'Team 2 is required'],
    trim: true,
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true,
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
    trim: true,
  },
  selectedTeam: {
    type: String,
    enum: [null, 'team1', 'team2'], // Only allow 'team1', 'team2', or null
    default: null,
  },
  mom: {
    type: String,
    trim: true,
    default: '',
  },
  result: {
    type: String,
    enum: [null, 'team1', 'team2'], // Only allow 'team1', 'team2', or null
    default: null,
  },
  momWinner: {
    type: String,
    trim: true,
    default: '',
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Indexes for frequently queried fields
matchSchema.index({ date: 1 });
matchSchema.index({ team1: 1 });
matchSchema.index({ team2: 1 });

// Method to find matches by date
matchSchema.statics.findByDate = function (date) {
  return this.find({ date });
};

// Method to update match result
matchSchema.statics.updateResult = function (matchId, result) {
  return this.findByIdAndUpdate(matchId, { result }, { new: true });
};

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;