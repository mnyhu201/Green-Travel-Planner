
const express = require('express');
const router = express.Router();

const { getWeatherForecast } = require('../controllers/weatherController');

router.get('/', getWeatherForecast);

module.exports = router;
