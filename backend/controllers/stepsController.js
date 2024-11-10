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
      const { lat, lng } = address;
      const activity = await findClosestActivity(lat, lng);
      if (activity) {
        return activity;
      } else {
        return {
          message: 'No suitable eco-friendly activity found within 1000 meters',
          lat,
          lng,
        };
      }
    });

    const ecoFriendlyActivities = await Promise.all(activitiesPromises);

    // Filter to remove duplicates and objects without a `name` attribute
    const uniqueEcoFriendlyActivities = ecoFriendlyActivities
        .filter(activity => activity.name) // Keep only objects with a `name` attribute
        .reduce((acc, current) => {
            const isDuplicate = acc.some(activity => activity.name === current.name);
            if (!isDuplicate) {
                acc.push(current);
            }
            return acc;
        }, []);


    res.status(200).json({ uniqueEcoFriendlyActivities });
  } catch (error) {
    console.error('Error in getEcoFriendlyActivities:', error.message);
    res.status(500).json({ error: 'Failed to retrieve eco-friendly activities' });
  }
}

module.exports = {
  getEcoFriendlyActivities,
};
