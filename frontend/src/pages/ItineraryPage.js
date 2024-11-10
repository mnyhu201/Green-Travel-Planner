// Example HomePage.js
import React, { useEffect } from 'react';
import ItineraryForm from '../components/ItineraryForm';
import { useNavigate } from 'react-router-dom';

const ItineraryPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
      // Check if the token exists in local storage
      const token = localStorage.getItem('idToken');
      console.log('idToken: ', token)
      if (!token) {
        // If no token is found, redirect to the login page
        navigate('/signin');
      }
    }, [navigate]);

    return(
        <div>
            <h1>Itinerary Page</h1>
            <ItineraryForm />
        </div>
    )
}

export default ItineraryPage;
