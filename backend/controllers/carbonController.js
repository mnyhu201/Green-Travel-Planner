// carbonController.js
const calculateTotalCarbonEmissions = require('../utils/carbonCalculator');

exports.calculateCarbonFootprint = (req, res) => {
const travelSegments = req.body.travelSegments;

    if (!travelSegments || !Array.isArray(travelSegments)) {
    return res.status(400).json({ error: "Invalid or missing travel segments" });
  }

  try {
    const result = calculateTotalCarbonEmissions(travelSegments);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while calculating carbon emissions" });
  }
};