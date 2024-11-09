import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => (
  <div>
    <h1>Welcome to Green Travel Planner</h1>
    <p>Plan your eco-friendly travels with ease.</p>
    <Link to="/itinerary">Get Started</Link>
  </div>
);

export default HomePage;
