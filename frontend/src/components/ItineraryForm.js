import React, { useState, useRef } from 'react';
import {
  GoogleMap,
  Autocomplete,
  DirectionsRenderer,
  useJsApiLoader,
} from '@react-google-maps/api';
import './ItineraryForm.css';
import RouteDisplay from './RouteDisplay';
import ActivityCarousel from './ActivityCarousel';

// Constants
const API_KEY = 'AIzaSyB2-KS_YHH2UJQPsFiRmXp2i5klSKI2La0'; // Replace with your API key
const DEFAULT_CENTER = { lat: 34.05, lng: -118.24 }; // Default to Los Angeles

const INITIAL_ACTIVITIES = [
  {
    phone: '123-456-7890',
    imageLinks: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/200',
      'https://via.placeholder.com/250',
    ],
    name: 'Adventure Park',
    hours: '9:00 AM - 8:00 PM',
    rating: '4.5/5',
    address: '123 Adventure Lane, Fun City, FC 12345',
    description:
      'A fun place to enjoy outdoor activities with your family and friends!',
  },
  {
    phone: '987-654-3210',
    imageLinks: [
      'https://via.placeholder.com/300',
      'https://via.placeholder.com/350',
    ],
    name: 'Cultural Museum',
    hours: '10:00 AM - 5:00 PM',
    rating: '4.8/5',
    address: '456 History Rd, Culture Town, CT 45678',
    description:
      'Explore the rich cultural heritage of our community at this wonderful museum!',
  },
  {
    phone: '111-222-3333',
    imageLinks: [
      'https://via.placeholder.com/400',
      'https://via.placeholder.com/450',
    ],
    name: 'Nature Walk',
    hours: '6:00 AM - 6:00 PM',
    rating: '4.7/5',
    address: '789 Greenway Blvd, Nature City, NC 78901',
    description:
      'Enjoy a serene walk through beautiful nature trails and experience the beauty of local flora and fauna.',
  },
];

function ItineraryForm() {
  // State variables
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [travelMode, setTravelMode] = useState('DRIVING');
  const [directions, setDirections] = useState(null);
  const [routeDisplay, setRouteDisplay] = useState({});
  const [displayMessage, setDisplayMessage] = useState(
    'The Route Recommendations will Appear here.'
  );
  const [travelModeDisplay, setTravelModeDisplay] = useState('');
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [selectedActivities, setSelectedActivities] = useState([]);

  // calculate credits
  const [credit, setCredit] = useState(0);

  // Refs for Autocomplete inputs
  const originRef = useRef();
  const destinationRef = useRef();

  // state variable for route info
  const [routeInfo, setRouteInfo] = useState({});

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
    libraries: ['places'],
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  // Handle place selection
  const handlePlaceSelect = (autocomplete, setFunction) => {
    const place = autocomplete.getPlace();
    if (place.formatted_address) {
      setFunction(place.formatted_address);
    }
  };

  // Extract route information
  const extractRouteInfo = (result) => {
    const route = result.routes[0].legs[0];
    return {
      origin: route.start_address,
      destination: route.end_address,
      distance: route.distance.text,
      duration: route.duration.text,
      steps: route.steps.map((step) => ({
        travel_mode: step.travel_mode,
        instruction: step.instructions,
        distance: step.distance.text,
        duration: step.duration.text,
        start_location: {
          lat: step.start_location.lat(),
          lng: step.start_location.lng(),
        },
        end_location: {
          lat: step.end_location.lat(),
          lng: step.end_location.lng(),
        },
        transit_details: step.transit
          ? {
              line_name: step.transit.line.name,
              line_short_name: step.transit.line.short_name,
              vehicle_type: step.transit.line.vehicle.type,
              departure_stop: step.transit.departure_stop.name,
              arrival_stop: step.transit.arrival_stop.name,
              num_stops: step.transit.num_stops,
            }
          : null,
      })),
    };
  };

  // Calculate the route
  const calculateRoute = () => {
    if (origin && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode[travelMode],
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            const routeInfo = extractRouteInfo(result);
            setDirections(result);
            sendRouteInfoToBackend(routeInfo);
            fetchActivityData(routeInfo);
          } else {
            console.error(`Error fetching directions ${result}`);
          }
        }
      );
    }
    setSelectedActivities([]);
  };

  // Send route information to the backend
  const sendRouteInfoToBackend = (routeInfo) => {
    console.log('Route Info:', routeInfo);
    setRouteInfo(routeInfo);

    fetch('http://localhost:4000/carbon/calculate-carbon-footprint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(routeInfo),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Successfully sent route data to the backend:', data);
        setRouteDisplay({
          footPrintColor: data.footPrintColor,
          totalCalories: data.totalCalories,
          totalDistance: data.totalDistance,
          totalEmissions: data.totalEmissions,
          totalTime: data.totalTime,
        });

        setDisplayMessage('');
        setTravelModeDisplay(travelMode);
        

        // set the credits
        if (data.totalCalories == 0) {
          setCredit(-1 * data.totalTime);
        }

        else {
          setCredit(data.totalTime);
        }
      })
      .catch((error) => {
        console.error('Error sending route data to backend:', error);
      });
  };

  // Fetch activity data from the backend
  const fetchActivityData = (routeInfo) => {
    fetch('http://localhost:4000/activity-search/eco-friendly-activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(routeInfo),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Activity data:', data);
        const activitiesList = data.uniqueEcoFriendlyActivities.map(
          (activity) => ({
            phone: activity.phone || 'N/A',
            imageLinks: activity.photos || [],
            name: activity.name || 'N/A',
            hours: activity.opening_hours || 'N/A',
            rating: activity.rating ? `${activity.rating}/5` : 'N/A',
            address: activity.address || 'N/A',
            description:
              activity.description && activity.description !== 'N/A'
                ? activity.description
                : 'No description available.',
          })
        );
        setActivities(activitiesList);
      })
      .catch((error) => {
        console.error('Error fetching activity data:', error);
      });
  };

  return (
    <div>
      <div className="form-container">
        <Autocomplete
          onLoad={(autocomplete) => (originRef.current = autocomplete)}
          onPlaceChanged={() =>
            handlePlaceSelect(originRef.current, setOrigin)
          }
        >
          <input type="text" placeholder="Start Location" />
        </Autocomplete>

        <Autocomplete
          onLoad={(autocomplete) => (destinationRef.current = autocomplete)}
          onPlaceChanged={() =>
            handlePlaceSelect(destinationRef.current, setDestination)
          }
        >
          <input type="text" placeholder="Destination" />
        </Autocomplete>

        <select
          value={travelMode}
          onChange={(e) => setTravelMode(e.target.value)}
        >
          <option value="DRIVING">Driving</option>
          <option value="WALKING">Walking</option>
          <option value="BICYCLING">Biking</option>
          <option value="TRANSIT">Transit</option>
        </select>

        <button className="calculate-button" onClick={calculateRoute}>
          Calculate Route
        </button>
      </div>

      <div className="content-container">
        <div className="map-container">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={DEFAULT_CENTER}
            zoom={12}
          >
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </div>
        <div className="recommendations">
          {displayMessage}
          {displayMessage === '' && (
            <>
              <RouteDisplay
                distance={routeDisplay.totalDistance}
                time={routeDisplay.totalTime}
                calories={routeDisplay.totalCalories}
                colors={routeDisplay.footPrintColor}
                carbon={routeDisplay.totalEmissions}
                method={travelModeDisplay}
                credits={credit}
                routeInfo={routeInfo}
              />
              <ActivityCarousel travel_mode={travelMode} activities={activities} routeInfo={routeInfo} selectedActivities={selectedActivities} setSelectedActivities={setSelectedActivities}/>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItineraryForm;
