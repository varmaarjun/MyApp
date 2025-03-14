const express = require('express');
const serverless = require('serverless-http');
const path = require('path');

// Use path.resolve to construct absolute paths
const authRoutes = require(path.resolve(__dirname, './routes/auth'));
const dashboardRoutes = require(path.resolve(__dirname, './routes/dashboard'));
const adminRoutes = require(path.resolve(__dirname, './routes/admin'));
const matchesRoutes = require(path.resolve(__dirname, './routes/matches'));

const app = express();

app.use(express.json());

// Define routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/admin', adminRoutes);
app.use('/matches', matchesRoutes);

module.exports.handler = serverless(app);
