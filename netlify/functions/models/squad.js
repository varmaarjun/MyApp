const mongoose = require('mongoose');

const squadSchema = new mongoose.Schema({
  team: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
  },
  playerName: {
    type: String,
    required: [true, 'Player name is required'],
    trim: true,
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Ensure player names are unique within a team
squadSchema.index({ team: 1, playerName: 1 }, { unique: true });

// Method to find players by team
squadSchema.statics.findByTeam = function (team) {
  return this.find({ team });
};

// Method to update player details
squadSchema.statics.updatePlayer = function (playerId, updateData) {
  return this.findByIdAndUpdate(playerId, updateData, { new: true });
};

const Squad = mongoose.model('Squad', squadSchema);
module.exports = Squad;