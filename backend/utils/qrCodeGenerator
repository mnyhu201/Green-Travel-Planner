// utils/qrCodeGenerator.js

require('dotenv').config();
const axios = require('axios');
const QRCode = require('qrcode');

// Function to generate a QR code URL for a route
async function generateQRCodeForRoute(routeParams) {
  const {
    start_location,
    end_location,
    travel_method,
    waypoints, // Now accepting waypoints as an array
  } = routeParams;

  const apiKey = 'AIzaSyB2-KS_YHH2UJQPsFiRmXp2i5klSKI2La0';
  if (!apiKey) {
    throw new Error('Google Maps API key is not set in environment variables.');
  }

  try {
    // Validate waypoints
    const waypointsArray = Array.isArray(waypoints) ? waypoints.filter(Boolean) : [];

    // Geocode all locations to get their coordinates
    const allLocations = [start_location, ...waypointsArray];

    const geocodedLocations = await Promise.all(
      allLocations.map(async (location) => {
        const coords = await geocodeAddress(location, apiKey);
        return { location, coords };
      })
    );

    // Calculate distances from start location to each waypoint
    const startCoords = geocodedLocations[0].coords;

    const waypointsWithDistance = geocodedLocations.slice(1).map((wp) => {
      const distance = getDistanceFromLatLonInKm(
        startCoords.lat,
        startCoords.lng,
        wp.coords.lat,
        wp.coords.lng
      );
      return { ...wp, distance };
    });

    // Sort waypoints by distance from start location
    const sortedWaypoints = waypointsWithDistance.sort(
      (a, b) => a.distance - b.distance
    );

    // Construct the Google Maps URL
    const travelMode = getTravelMode(travel_method);
    const waypointsStr = sortedWaypoints
      .map((wp) => encodeURIComponent(wp.location))
      .join('%7C'); // Use '%7C' as the separator for waypoints

    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      start_location
    )}&destination=${encodeURIComponent(
      end_location
    )}&travelmode=${travelMode}${
      waypointsStr ? `&waypoints=${waypointsStr}` : ''
    }`;

    // Generate QR code for the URL
    const qrCodeDataUrl = await QRCode.toDataURL(mapsUrl);

    return {
      qrCodeDataUrl,
      mapsUrl,
    };
  } catch (error) {
    console.error('Error generating QR code for route:', error.message);
    throw error;
  }
}

// Function to geocode an address
async function geocodeAddress(address, apiKey) {
  const url = 'https://maps.googleapis.com/maps/api/geocode/json';

  const response = await axios.get(url, {
    params: {
      address,
      key: apiKey,
    },
  });

  if (response.data.status !== 'OK') {
    throw new Error(
      `Geocoding API error for address "${address}": ${response.data.status}`
    );
  }

  const location = response.data.results[0].geometry.location;
  return location; // { lat: ..., lng: ... }
}

// Helper function to calculate distance between two coordinates (in km)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Helper function to get the travel mode parameter
function getTravelMode(travelMethod) {
  const validModes = ['driving', 'walking', 'bicycling', 'transit'];
  if (validModes.includes(travelMethod.toLowerCase())) {
    return travelMethod.toLowerCase();
  }
  return 'driving'; // Default to driving if invalid
}

module.exports = {
  generateQRCodeForRoute,
};
