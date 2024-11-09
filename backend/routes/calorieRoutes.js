// routes/calorieRoutes.js

// request body:
// {
//     "weight": 65,
//     "travelType": "biking",
//     "distance": 10
// }
const express = require('express');
const router = express.Router();
const { calculateCalories } = require('../controllers/calorieController');

router.get('/', calculateCalories);

module.exports = router;
