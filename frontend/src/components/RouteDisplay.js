import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoePrints } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';

import './RouteDisplay.css'; // Importing the new CSS file
import { useState } from 'react';


const RouteDisplay = ({ method, distance, calories, carbon, time, colors, credits }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionDisabled, setCompletionDisabled] = useState(false);

  // Toggle the "completed" state
  const toggleCompleted = async () => {
    setIsCompleted(!isCompleted);
    increaseCredit();
    setCompletionDisabled(true);
  };

  // State to manage whether the bookmark is solid or regular
  const [isBookmarked, setIsBookmarked] = useState(false);
  // Toggle the bookmark state
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // submit post request to backend to increment / decrement credits
  // Define the function to fetch user data
  const increaseCredit = async () => {
    const email = localStorage.getItem('email');    
    console.log(localStorage);
    if (!email) {
      return;
    }

    try {
      const response = await axios.put(`http://localhost:4000/user/${email}/update-score`, {
        change: credits,  // Replace `newScore` with the actual data you want to send
      });
      console.log(`increased by ${credits}`);
        } catch (err) {
          console.log(err);
    } finally {
    }
  };
  

  return (
    <div className="route-container">
      <div className="route-header">
        <h2 className="route-method">
          Method: {method}
          <FontAwesomeIcon 
            icon={faShoePrints} 
            className="route-icon" 
            style={{ color: colors || '#2a9d8f' }} 
          />
        </h2>
        <div className="route-buttons">
          <button
            className={`complete-button ${isCompleted ? 'completed' : 'incomplete'}`}
            onClick={toggleCompleted}
            disabled={completionDisabled}
          >
            {isCompleted ? 'Completed' : `Mark as Completed (${credits} carbon credits)`}
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
          <span><strong>Carbon Emission: </strong> {carbon} kg</span>
        </div>
      </div>
    </div>
  );
};

export default RouteDisplay;
