// controllers/calorieController.js

// Helper function to perform calorie calculation
function calculateCaloriesHelper(weight, travelType, distance) {
    let MET;
    
    if (travelType === 'biking') {
      MET = 8.0; // moderate biking (12-14 mph)
    } else if (travelType === 'walking') {
      MET = 4.3; // brisk walking (4 mph)
    } else {
      throw new Error('Invalid form of travel');
    }
  
    const speed = travelType === 'biking' ? 20.9 : 6.4; // speed in km/h
    const duration = distance / speed; // time in hours
  
    return MET * weight * duration;
  }
  
// Controller function to handle the POST request
exports.calculateCalories = (req, res) => {
    const { weight, travelType, distance } = req.body;

    try {
        const calories = Math.round(calculateCaloriesHelper(weight, travelType, distance));
        console.log("success fetching calorie data");
        res.json({ calories });
        } 
        catch (error) {
        res.status(400).json({ error: error.message });
    }
};
  