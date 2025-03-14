const mongoose = require('mongoose');

const squadSchema = new mongoose.Schema({
  team: String,
  playerName: String
});

const Squad = mongoose.model('Squad', squadSchema);
module.exports = Squad;
