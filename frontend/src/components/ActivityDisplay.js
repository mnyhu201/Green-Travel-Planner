import React, { useState } from 'react';
import './ActivityDisplay.css';

const ActivityDisplay = ({ phone, imageLinks, name, hours, rating, address, description }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageLinks.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageLinks.length - 1 : prevIndex - 1
    );
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
