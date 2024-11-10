import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ActivityDisplay.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';

const ActivityDisplay = ({ phone, imageLinks, name, hours, rating, address, description, routeInfo, selectedActivities, setSelectedActivities }) => {

  console.log("recieved route info: ");
  console.log({routeInfo});

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSelected, setCurrentSelected] = useState(false);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageLinks.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageLinks.length - 1 : prevIndex - 1
    );
  };

  // select the activity to the state
  const selectActivity = () => {
    setSelectedActivities((prevSelected) => {
        if (prevSelected.includes(name)) {
            return prevSelected.filter(n => n !== name);
        } else {
            return [...prevSelected, name];
        }
    });
};



  // State to manage whether the bookmark is solid or regular
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = () => {
    setIsBookmarked(isBookmarked => !isBookmarked);
    const input = {phone, imageLinks, name, hours, rating, address}
    axios.put(`http://localhost:4000/user/${localStorage.getItem('email')}/add-activity`, input)
  };



  return (
    <div className="activity-display-container">
    <div className='top'>
        <div className="activity-left">
            <div className="image-carousel">
            <img src={imageLinks[currentImageIndex]} alt={`Activity ${name}`} className="activity-image" />
            <button className="carousel-button prev-button" onClick={handlePreviousImage}>&lt;</button>
            <button className="carousel-button next-button" onClick={handleNextImage}>&gt;</button>
            </div>
        </div>
        <div className="activity-right">
            <h3 className="activity-name">{name}</h3>
            <button onClick={selectActivity}>{(!selectedActivities.includes(name)) ? "Add to itinerary" : "Remove from itinerary" }</button>
            <FontAwesomeIcon 
              className='save-button'
              icon={isBookmarked ? solidBookmark : regularBookmark} 
              onClick={toggleBookmark}
              style={{ cursor: 'pointer', marginLeft: '8px' }}
            />
            <p className="activity-hours"><strong>Hours: </strong>{hours}</p>
            <p className="activity-rating"><strong>Rating: </strong>{rating}</p>
            <p className="activity-address"><strong>Address: </strong>{address}</p>
            <p className="activity-phone"><strong>Phone: </strong>{phone}</p>
        </div>
       
        </div>

        <div className='bottom'>
            <p className="activity-description">{description}</p>
        </div>
      

    </div>
    
  );
};

export default ActivityDisplay;
