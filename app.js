const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./database');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin'); // Add admin routes
const matchesRoutes = require('./routes/matches'); // Add matches routes
const squadsRoutes = require('./routes/squads'); // Import the new squad routes
const cors = require('cors');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware for CORS
app.use(cors({
  origin: 'https://my-app-deploy-six.vercel.app', // Replace with your Vercel domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/admin', adminRoutes); // Use admin routes
app.use('/matches', matchesRoutes); // Use matches routes
app.use('/squads', squadsRoutes); // Use squads routes

// Route to serve the landing page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
