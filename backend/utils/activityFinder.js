// utils/activityFinder.js

require('dotenv').config();
const axios = require('axios');

// Function to select key steps (unchanged)
function selectKeySteps(steps) {
  const totalSteps = steps.length;
  const maxSteps = 5;
  const selectedAddresses = [];

  if (totalSteps <= maxSteps) {
    steps.forEach(step => {
      selectedAddresses.push(step.start_location);
    });
  } else {
    for (let i = 1; i <= maxSteps; i++) {
      const position = Math.round((i * totalSteps) / (maxSteps + 1)) - 1;
      selectedAddresses.push(steps[position].start_location);
    }
  }

  return selectedAddresses;
}

// Helper function to calculate distance between two coordinates
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
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

// Function to find the closest eco-friendly activity within a specified distance
async function findClosestActivity(latitude, longitude) {
  const apiKey = 'AIzaSyB2-KS_YHH2UJQPsFiRmXp2i5klSKI2La0';
  const keyword = 'green';
  const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

  try {
    const response = await axios.get(url, {
      params: {
        location: `${latitude},${longitude}`,
        rankby: 'distance',
        keyword,
        key: apiKey,
      },
    });

    const places = response.data.results;
    console.log(`API Response Status: ${response.data.status}`);
    if (response.data.error_message) {
      console.error(`API Error Message: ${response.data.error_message}`);
    }
    console.log(`Found ${places.length} places for location ${latitude}, ${longitude}`);

    if (places.length === 0) {
      console.log('No places found by the API.');
      return null;
    }

    for (let place of places) {
      console.log(
        `Checking place: ${place.name}, Business Status: ${place.business_status}, Rating: ${place.rating}`
      );

      // Exclude places that are permanently or temporarily closed
      if (
        place.business_status === 'CLOSED_PERMANENTLY' ||
        place.business_status === 'CLOSED_TEMPORARILY'
      ) {
        console.log(`Skipping ${place.name} because it's closed.`);
        continue;
      }

      // Exclude places with rating below 2
      if (place.rating && place.rating < 2) {
        console.log(`Skipping ${place.name} because rating is below 2.`);
        continue;
      }

      const placeLat = place.geometry.location.lat;
      const placeLng = place.geometry.location.lng;
      const distance =
        getDistanceFromLatLonInKm(latitude, longitude, placeLat, placeLng) *
        1000; // Convert to meters

      console.log(`Distance to ${place.name}: ${distance} meters`);

      if (distance <= 1000) {
        // Get additional details
        const details = await getPlaceDetails(place.place_id);
        if (details) {
          return details;
        } else {
          console.log(`No details found for ${place.name}`);
        }
      }
    }

    // No suitable place found within the specified distance
    return null;
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error in request setup:', error.message);
    }
    throw error;
  }
}
async function getPlaceDetails(placeId) {
    const apiKey = 'AIzaSyB2-KS_YHH2UJQPsFiRmXp2i5klSKI2La0';
    const url = 'https://maps.googleapis.com/maps/api/place/details/json';
  
    try {
        const response = await axios.get(url, {
          params: {
            place_id: placeId,
            fields:
              'name,formatted_address,address_component,formatted_phone_number,website,opening_hours,rating,reviews,geometry,business_status,photos',
            key: apiKey,
          },
        });
    
        const status = response.data.status;
        if (status !== 'OK') {
          console.error(`Place Details API returned status: ${status}`);
          if (response.data.error_message) {
            console.error(`Error message: ${response.data.error_message}`);
          }
          return null;
        }
    
        const result = response.data.result;
    
        // Exclude places that are permanently or temporarily closed
        if (
          result.business_status === 'CLOSED_PERMANENTLY' ||
          result.business_status === 'CLOSED_TEMPORARILY'
        ) {
          console.log(`Skipping ${result.name} because it's closed.`);
          return null;
        }
    
        // Exclude places with rating below 2
        if (result.rating && result.rating < 2) {
          console.log(`Skipping ${result.name} because rating is below 2.`);
          return null;
        }
    
        // Get opening hours for the current day and open_now status
        let todaysHours = 'Unavaible';
        let isOpenNow = 'Unknown';
        if (result.opening_hours) {
          if (result.opening_hours.weekday_text) {
            const weekdayText = result.opening_hours.weekday_text;
            const currentDayIndex = getCurrentDayIndex();
            todaysHours = weekdayText[currentDayIndex] || todaysHours;
          }
    
          // Get the open_now status
          if (typeof result.opening_hours.open_now !== 'undefined') {
            isOpenNow = result.opening_hours.open_now ? 'Open' : 'Closed';
          }
        }
    
        // Construct a shorter address using address components
        const shortAddress = getShortAddress(result.address_components);
    
        // Get photo URLs
        let photoUrls = [];
        if (result.photos && result.photos.length > 0) {
          photoUrls = result.photos.map(photo => {
            const photoReference = photo.photo_reference;
            // Construct the photo URL
            return getPhotoUrl(photoReference);
          });
        }
    
        return {
          name: result.name || 'N/A',
          address: shortAddress || result.formatted_address || 'N/A',
          phone: result.formatted_phone_number || 'N/A',
          website: result.website || 'N/A',
          opening_hours: todaysHours,
          is_open_now: isOpenNow,
          rating: result.rating || 'N/A',
          reviews: result.reviews || [],
          photos: photoUrls,
          description: 'N/A',
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
          business_status: result.business_status,
        };
      } catch (error) {
        if (error.response) {
          console.error('API Error in getPlaceDetails:', error.response.data);
        } else if (error.request) {
          console.error('No response received in getPlaceDetails:', error.request);
        } else {
          console.error('Error in request setup in getPlaceDetails:', error.message);
        }
        throw error;
      }
    }
  
    function getCurrentDayIndex() {
        // Get the current time in PT
        const now = new Date();
      
        // Options to specify time zone as 'America/Los_Angeles' (Pacific Time)
        const options = { timeZone: 'America/Los_Angeles' };
        const formatter = new Intl.DateTimeFormat('en-US', options);
      
        // Get the current day in PT
        const currentDay = new Date(formatter.format(now));
      
        // getDay() returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday
        // Adjust to match Google's weekday_text array (Monday is index 0)
        let dayIndex = currentDay.getDay() - 1; // Adjust so Monday is 0
        if (dayIndex < 0) {
          dayIndex = 6; // If Sunday (-1), set to Saturday index (6)
        }
        return dayIndex;
      }
      

  // Helper function to construct a shorter address
function getShortAddress(addressComponents) {
    if (!addressComponents) {
      return null;
    }
  
    let streetNumber = '';
    let route = '';
    let locality = '';
    let administrativeAreaLevel1 = ''; // State
    let country = '';
  
    for (const component of addressComponents) {
      const types = component.types;
      if (types.includes('street_number')) {
        streetNumber = component.short_name;
      }
      if (types.includes('route')) {
        route = component.short_name;
      }
      if (types.includes('locality')) {
        locality = component.short_name;
      }
      if (types.includes('administrative_area_level_1')) {
        administrativeAreaLevel1 = component.short_name;
      }
      if (types.includes('country')) {
        country = component.short_name;
      }
    }
  
    // Construct the short address
    const addressParts = [];
    if (streetNumber && route) {
      addressParts.push(`${streetNumber} ${route}`);
    } else if (route) {
      addressParts.push(route);
    }
    if (locality) {
      addressParts.push(locality);
    }
    if (administrativeAreaLevel1) {
      addressParts.push(administrativeAreaLevel1);
    }
  
    // Since it's mostly local within California, you may choose to exclude the state
    // If you want to exclude the state, comment out the above line adding administrativeAreaLevel1
  
    return addressParts.join(', ');
  }

  // Helper function to construct a photo URL
function getPhotoUrl(photoReference) {
    const apiKey = 'AIzaSyB2-KS_YHH2UJQPsFiRmXp2i5klSKI2La0';
    const maxWidth = 800; // You can adjust the max width as needed
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${apiKey}`;
  }

module.exports = {
  selectKeySteps,
  findClosestActivity,
};
