// carbonRoutes.js
const express = require('express');
const router = express.Router();
const { calculateCarbonFootprint } = require('../controllers/carbonController');

router.post('/calculate-carbon-footprint', calculateCarbonFootprint);

module.exports = router;