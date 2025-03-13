const mongoose = require('mongoose');
const Squad = require('./models/squad'); // Ensure the path is correct

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/cricketBettingDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    const squads = [
      { team: 'CSK', playerName: 'Ruturaj Gaikwad' },
      { team: 'CSK', playerName: 'MS Dhoni' },
      { team: 'MI', playerName: 'Rohit Sharma' },
      { team: 'MI', playerName: 'Kieron Pollard' }
    ];
    return Squad.insertMany(squads);
  })
  .then(() => {
    console.log('Sample data inserted');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error inserting sample data:', err);
    mongoose.connection.close();
  });
