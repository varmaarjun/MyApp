const mongoose = require('mongoose');
const Squad = require('./models/squad');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/cricketBettingDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Fetch squad data
Squad.find({})
  .then(squads => {
    console.log('Squads:', squads);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error fetching squad data:', err);
    mongoose.connection.close();
  });
