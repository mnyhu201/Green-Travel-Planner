// controllers/stepsController.js

const { selectKeySteps, findClosestActivity } = require('../utils/activityFinder');

async function getEcoFriendlyActivities(req, res) {
  try {
    const steps = req.body.steps;

    if (!steps || !Array.isArray(steps)) {
      return res.status(400).json({ error: 'Invalid steps data' });
    }

    const keyAddresses = selectKeySteps(steps);

    const activitiesPromises = keyAddresses.map(async address => {
      const { latitude, longitude } = address;
      const activity = await findClosestActivity(latitude, longitude);
      if (activity) {
        return activity;
      } else {
        return {
          message: 'No suitable eco-friendly activity found within 1000 meters',
          latitude,
          longitude,
        };
      }
    });

    const ecoFriendlyActivities = await Promise.all(activitiesPromises);

    res.status(200).json({ ecoFriendlyActivities });
  } catch (error) {
    console.error('Error in getEcoFriendlyActivities:', error.message);
    res.status(500).json({ error: 'Failed to retrieve eco-friendly activities' });
  }
}

module.exports = {
  getEcoFriendlyActivities,
};
