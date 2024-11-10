// app.js
const express = require('express');
const cors = require('cors');
const calorieRoutes = require('./routes/calorieRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const carbonRoutes = require('./routes/carbonRoutes')

const app = express();

// Middleware
app.use(cors()); // Allow CORS
app.use(express.json());

// Routes
// calculate the calories
app.use('/calculate-calories', calorieRoutes);
// get seven day weather forcast
app.use('/weather', weatherRoutes);
// calculate the carbon emissions
app.use('/carbon', carbonRoutes)


module.exports = app;
