const express = require('express');
const serverless = require('serverless-http');

// Adjusted paths for routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');
const matchesRoutes = require('./routes/matches');

const app = express();

app.use(express.json());

// Define routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/admin', adminRoutes);
app.use('/matches', matchesRoutes);

module.exports.handler = serverless(app);
