import React, { useState, useRef } from 'react';
import {
  GoogleMap,
  Autocomplete,
  DirectionsRenderer,
  useJsApiLoader,
} from '@react-google-maps/api';
import './ItineraryForm.css';
import RouteDisplay from './RouteDisplay';

const API_KEY = 'AIzaSyB2-KS_YHH2UJQPsFiRmXp2i5klSKI2La0' // Replace with your API key
const center = {
  lat: 34.05, // Default to LA
  lng: -118.24,
};

function ItineraryForm() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [directions, setDirections] = useState(null);
  const [travelMode, setTravelMode] = useState('DRIVING');
  const originRef = useRef();
  const destinationRef = useRef();

  const [routeDisplay, setRouteDisplay] = useState({});
  const [displayMessage, setDisplayMessage] = useState("The Route Recommendations will Appear here.");
  const [travelModeDisplay, setTravelModeDisplay] = useState('');

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
    libraries: ['places'],
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }

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
            setDirections(result);
            sendRouteInfoToBackend(result);
          } else {
            console.error(`Error fetching directions ${result}`);
          }
        }
      );
    }
  };

  const sendRouteInfoToBackend = (result) => {
    const route = result.routes[0].legs[0];
    const routeInfo = {
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

    console.log(routeInfo);

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

        setDisplayMessage("");
        setTravelModeDisplay(travelMode);
      })
      .catch((error) => {
        console.error('Error sending route data to backend:', error);
      });
  };

  const handlePlaceSelect = (autocomplete, setFunction) => {
    const place = autocomplete.getPlace();
    if (place.formatted_address) {
      setFunction(place.formatted_address);
    }
  };

  return (
    <div>
      <div className="form-container">
        <Autocomplete
          onLoad={(autocomplete) => (originRef.current = autocomplete)}
          onPlaceChanged={() => handlePlaceSelect(originRef.current, setOrigin)}
        >
          <input type="text" placeholder="Start Location" />
        </Autocomplete>

        <Autocomplete
          onLoad={(autocomplete) => (destinationRef.current = autocomplete)}
          onPlaceChanged={() => handlePlaceSelect(destinationRef.current, setDestination)}
        >
          <input type="text" placeholder="Destination" />
        </Autocomplete>

        <select value={travelMode} onChange={(e) => setTravelMode(e.target.value)}>
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
            center={center}
            zoom={12}
          >
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </div>
        <div className="recommendations">
          {displayMessage}
          {displayMessage === "" && <RouteDisplay distance={routeDisplay.totalDistance} time={routeDisplay.totalTime} calories={routeDisplay.totalCalories} colors={routeDisplay.footPrintColor} carbon={routeDisplay.totalEmissions} method={travelModeDisplay} />}
        </div>
      </div>
    </div>
  );
}

export default ItineraryForm;
