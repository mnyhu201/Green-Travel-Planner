import React, { useState } from 'react';
import ActivityDisplay from './ActivityDisplay';
import './ActivityCarousel.css';

const ActivityCarousel = ({ activities, routeInfo }) => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  const handleNextActivity = () => {
    setCurrentActivityIndex((prevIndex) => (prevIndex + 1) % activities.length);
  };

  const handlePreviousActivity = () => {
    setCurrentActivityIndex((prevIndex) =>
      prevIndex === 0 ? activities.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="activity-carousel-container">
        <ActivityDisplay {...activities[currentActivityIndex]} routeInfo={routeInfo} />
      <button className="activity-carousel-button left-button" onClick={handlePreviousActivity}>&lt;</button>
      <button className="activity-carousel-button right-button" onClick={handleNextActivity}>&gt;</button>
    </div>
  );
};

export default ActivityCarousel;
