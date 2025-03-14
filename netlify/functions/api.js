const express = require('express');
const serverless = require('serverless-http');
const app = express();

app.use(express.json());

// Define your routes
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/admin', require('./routes/admin'));
app.use('/matches', require('./routes/matches'));

module.exports.handler = serverless(app);
