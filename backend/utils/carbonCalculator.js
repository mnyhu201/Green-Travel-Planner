const calculateCaloriesHelper = require('../controllers/calorieController').calculateCaloriesHelper;

function calculateTotalCarbonEmissions(travelData, weight = 160) {
  // Ensure travelData and travelData.steps are defined
  if (!travelData || !travelData.steps || !Array.isArray(travelData.steps)) {
    throw new Error("Invalid travel data: 'steps' is missing or not an array");
  }

  const emissionFactors = {
    WALKING: 0,
    TRANSIT: 0.18,
    DRIVING: 0.4,
  };

  let totalEmissions = 0;
  let totalDistance = 0;
  let totalTime = 0; // in minutes
  let totalCalories = 0;

  travelData.steps.forEach((segment) => {
    const { travel_mode, distance, duration } = segment;
    const factor = emissionFactors[travel_mode] || 0;

    // Convert distance to miles if it's in feet
    const segmentDistance = parseDistance(distance);
    const segmentTime = parseDuration(duration);

    // Calculate emissions
    const segmentEmissions = segmentDistance * factor;
    totalEmissions += segmentEmissions;
    totalDistance += segmentDistance;
    totalTime += segmentTime;

    // Calculate calories for WALKING
    if (travel_mode === 'WALKING' || travel_mode === 'BIKING') {
      const travelType = travel_mode.toLowerCase();
      totalCalories += calculateCaloriesHelper(weight, travelType, segmentDistance);
    }
  });

  // Calculate the footprint color based on total emissions
  const footPrintColor = getFootprintColor(totalEmissions);

  return {
    totalEmissions: totalEmissions.toFixed(2), // kg CO₂
    totalDistance: totalDistance.toFixed(2),   // miles
    totalTime: totalTime,                      // minutes
    totalCalories: totalCalories.toFixed(2),   // calories burned
    footPrintColor: footPrintColor             // hex color based on emissions
  };
}

// Helper function to parse distance strings
function parseDistance(distance) {
  if (distance.includes('mi')) {
    return parseFloat(distance); // Distance in miles
  } else if (distance.includes('ft')) {
    return parseFloat(distance) / 5280; // Convert feet to miles
  }
  return 0; // Return 0 if the format is unrecognized
}

// Helper function to parse duration strings
function parseDuration(duration) {
  const timeParts = duration.match(/(\d+)\s*hours?|(\d+)\s*mins?/g);
  let totalMinutes = 0;

  if (timeParts) {
    timeParts.forEach((part) => {
      if (part.includes('hour')) {
        totalMinutes += parseInt(part) * 60;
      } else if (part.includes('min')) {
        totalMinutes += parseInt(part);
      }
    });
  }
  
  return totalMinutes;
}

// Helper function to determine the footprint color
function getFootprintColor(emissions) {
  const maxEmissions = 6.5; // Threshold for full red
  const green = { r: 0, g: 255, b: 0 };
  const red = { r: 255, g: 0, b: 0 };

  // Calculate the ratio (0 for low emissions, 1 for high emissions)
  const ratio = Math.min(emissions / maxEmissions, 1);

  // Interpolate between green and red based on the ratio
  const r = Math.round(green.r + ratio * (red.r - green.r));
  const g = Math.round(green.g + ratio * (red.g - green.g));
  const b = Math.round(green.b + ratio * (red.b - green.b));

  // Convert to hex color
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

module.exports = calculateTotalCarbonEmissions;
