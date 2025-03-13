const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./database');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin'); // Add admin routes
const cors = require('cors');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware for CORS
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/admin', adminRoutes); // Use admin routes

// Route to serve the landing page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
