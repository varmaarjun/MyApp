// const mongoose = require('mongoose');

// const connectDB = async () => {
//     try {
//         await mongoose.connect('mongodb://127.0.0.1:27017/cricketBettingDB', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//           });
          
//         console.log('MongoDB connected successfully');
//     } catch (error) {
//         console.error('Error connecting to MongoDB', error);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;



const mongoose = require('mongoose');
const uri = "mongodb+srv://varmaarjun09:6oG1T53PIUYTIKe8@myapp.x2bd7.mongodb.net/cricketBettingDB?retryWrites=true&w=majority";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await mongoose.disconnect();
  }
}
run().catch(console.dir);


