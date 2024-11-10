import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoePrints } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';

import './RouteDisplay.css'; // Importing the new CSS file
import { useState } from 'react';


const RouteDisplay = ({ method, distance, calories, carbon, time, colors }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  // Toggle the "completed" state
  const toggleCompleted = () => {
    setIsCompleted(!isCompleted);
  };

  // State to manage whether the bookmark is solid or regular
  const [isBookmarked, setIsBookmarked] = useState(false);
  // Toggle the bookmark state
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="route-container">
      <div className="route-header">
        <h2 className="route-method">
          Method: {method}
          <FontAwesomeIcon 
            icon={faShoePrints} 
            className="route-icon" 
            style={{ color: colors.iconColor || '#2a9d8f' }} 
          />
        </h2>
        <div className="route-buttons">
          <button
            className={`complete-button ${isCompleted ? 'completed' : 'incomplete'}`}
            onClick={toggleCompleted}
          >
            {isCompleted ? 'Completed' : 'Mark as Completed'}
          </button>

          <FontAwesomeIcon 
            className='save-button'
            icon={isBookmarked ? solidBookmark : regularBookmark} 
            onClick={toggleBookmark}
            style={{ cursor: 'pointer', marginLeft: '8px' }}
          />
        </div>
      </div>


      {/** Display the info */}
      <div className="route-details">
        <div className="row">
          <span><strong>Distance: </strong> {distance} km</span>
          <span><strong>Estimated Time: </strong> {time} mins</span>
        </div>
        
        <div className="row">
          <span><strong>Calories Burned: </strong> {calories} kcal</span>
          <span><strong>Carbon Emission Saved: </strong> {carbon} kg</span>
        </div>
      </div>
    </div>
  );
};

export default RouteDisplay;
