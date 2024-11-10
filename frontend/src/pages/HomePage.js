import React, { useEffect }  from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
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

  return (
    <div>
      <h1>Welcome to Green Travel Planner</h1>
      <p>Plan your eco-friendly travels with ease.</p>
      <Link to="/itinerary">Get Started</Link>
    </div>
  )
};

export default HomePage;
