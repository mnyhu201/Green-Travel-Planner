// carbonCalculator.js
function calculateTotalCarbonEmissions(travelSegments) {
    // Define emission factors in kg CO₂ per mile
    const emissionFactors = {
      WALKING: 0,
      TRANSIT: 0.18,
      DRIVING: 0.4,
    };
  
    // Initialize total emissions and total distance
    let totalEmissions = 0;
    let totalDistance = 0;
  
    // Loop through each travel segment to calculate emissions
    travelSegments.forEach((segment) => {
      const { travel_mode, distance } = segment;
      const factor = emissionFactors[travel_mode] || 0; // Default to 0 if travel_mode is not recognized
  
      // Calculate emissions for this segment and add it to total emissions
      const segmentEmissions = distance * factor;
      totalEmissions += segmentEmissions;
      totalDistance += distance;
    });
  
    // Return an object with the total emissions and total distance
    return {
      totalEmissions: totalEmissions.toFixed(2), // in kg CO₂
      totalDistance: totalDistance.toFixed(2),   // in miles
    };
  }
  
  module.exports = calculateTotalCarbonEmissions;