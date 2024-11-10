// controllers/qrCodeController.js

const { generateQRCodeForRoute } = require('../utils/qrCodeGenerator');

// Controller function to handle QR code generation
async function generateRouteQRCode(req, res) {

  console.log(res.body);
  const {
    start_location,
    end_location,
    travel_method,
    waypoints,
  } = req.body;

  const routeParams = {
    start_location,
    end_location,
    travel_method,
    waypoints,
  };

  try {
    const { qrCodeDataUrl, mapsUrl } = await generateQRCodeForRoute(routeParams);
    res.json({ qrCodeDataUrl, mapsUrl });
  } catch (error) {
    console.error('Error generating QR code:', error.message);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
}

module.exports = {
  generateRouteQRCode,
};
