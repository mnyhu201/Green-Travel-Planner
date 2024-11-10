// controllers/calorieController.js

// Helper function to perform calorie calculation
function calculateCaloriesHelper(weight, travelType, distance) {
  let MET;
  
  // MET values for different activities (biking and walking)
  if (travelType === 'biking') {
    MET = 8.0; // moderate biking (12-14 mph)
  } else if (travelType === 'walking') {
    MET = 4.3; // brisk walking (4 mph)
  } else {
    throw new Error('Invalid form of travel');
  }

  // Speeds in miles per hour
  const speed = travelType === 'biking' ? 13 : 4; // biking at ~13 mph, walking at ~4 mph
  const duration = distance / speed; // time in hours

  // Calories calculation using weight in pounds and distance in miles
  // Formula adjusted for American units: MET * weight (lbs) * duration (hours) * 0.453592 (conversion factor from lbs to kg)
  return MET * weight * duration * 0.453592;
}

// Controller function to handle the POST request
function calculateCalories(req, res) {
  const { weight = 160, travelType, distance } = req.body; // Default weight to 160 lbs if not provided

  try {
    const calories = Math.round(calculateCaloriesHelper(weight, travelType, distance));
    console.log("Success fetching calorie data");
    res.json({ calories });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Export both the helper and the controller function
module.exports = {
  calculateCaloriesHelper,
  calculateCalories
};
