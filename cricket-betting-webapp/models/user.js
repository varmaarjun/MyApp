const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    balance: { type: Number, default: 0 },
    matchesWins: { type: Number, default: 0 },
    matchesLost: { type: Number, default: 0 },
    momWins: { type: Number, default: 0 },
    role: { type: String, default: 'user' } // Add role field with default value 'user'
});

module.exports = mongoose.model('User', userSchema);
