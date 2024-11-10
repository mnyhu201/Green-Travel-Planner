// stepsRoutes.js

const express = require('express');
const router = express.Router();
const { getEcoFriendlyActivities } = require('../controllers/stepsController');

router.post('/eco-friendly-activities', getEcoFriendlyActivities);

module.exports = router;
