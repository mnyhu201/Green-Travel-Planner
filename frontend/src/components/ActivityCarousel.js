import React, { useState } from 'react';
import ActivityDisplay from './ActivityDisplay';
import './ActivityCarousel.css';
import axios from 'axios';

const ActivityCarousel = ({ activities, routeInfo, selectedActivities, setSelectedActivities, travel_mode}) => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  const handleNextActivity = () => {
    setCurrentActivityIndex((prevIndex) => (prevIndex + 1) % activities.length);
  };

  const handlePreviousActivity = () => {
    setCurrentActivityIndex((prevIndex) =>
      prevIndex === 0 ? activities.length - 1 : prevIndex - 1
    );
  };

  const handleCheckout = async () => {
      const addresses = selectedActivities.map(activityName => {
          const activity = activities.find(activity => activity.name === activityName);
          const getActivityAddress = activity ? activity.address : 'Activity not found';
          console.log(`Address for ${activityName}: ${getActivityAddress}`);
          return getActivityAddress
      });
      console.log({
        start_location:routeInfo.origin,
        stop: addresses,
        end_location:routeInfo.destination,
        routeInfo: routeInfo
      })
      
      const data = await axios.post('http://localhost:4000/checkout/generate-route-qr', {
        start_location:routeInfo.origin,
        waypoints: addresses,
        end_location:routeInfo.destination,
        travel_method: travel_mode
      });
      
      console.log(data);
      // console.log("checked out!", selectedActivities);
      // console.log(response);
  }


  return (
    <div className="activity-carousel-container">
        <ActivityDisplay {...activities[currentActivityIndex]} routeInfo={routeInfo} selectedActivities={selectedActivities} setSelectedActivities={setSelectedActivities}/>
      <button className="activity-carousel-button left-button" onClick={handlePreviousActivity}>&lt;</button>
      <button className="activity-carousel-button right-button" onClick={handleNextActivity}>&gt;</button>
      <button className="checkout" onClick={handleCheckout}>Checkout Itinerary</button>
    </div>
  );
};

export default ActivityCarousel;
