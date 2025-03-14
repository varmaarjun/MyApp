const mongoose = require('mongoose');

const uri = "mongodb+srv://varmaarjun09:6oG1T53PIUYTIKe8@myapp.x2bd7.mongodb.net/cricketBettingDB?retryWrites=true&w=majority";

// Options for MongoDB connection
const options = { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
};

const connectDB = async () => {
  try {
    await mongoose.connect(uri, options);
    console.log("MongoDB connected successfully to MongoDB Atlas!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
