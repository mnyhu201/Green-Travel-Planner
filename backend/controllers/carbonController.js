const calculateTotalCarbonEmissions = require('../utils/carbonCalculator');

exports.calculateCarbonFootprint = (req, res) => {
  // Access the data directly, assuming it's not wrapped in travelData
  const travelData = req.body;
  console.log(travelData);
  const weight = req.body.weight || 160;

  if (!travelData.steps || !Array.isArray(travelData.steps)) {
    return res.status(400).json({ error: "Invalid or missing steps data. Ensure 'steps' is an array." });
  }

  try {
    const result = calculateTotalCarbonEmissions(travelData, weight);
    res.json(result);
  } catch (error) {
    console.error("Calculation error:", error);
    res.status(500).json({ error: "An error occurred while calculating carbon emissions" });
  }
};
