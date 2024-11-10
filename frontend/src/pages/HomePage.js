import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';

const images = [
  'https://via.placeholder.com/600x400/FF5733/FFFFFF?text=Slide+1',
  'https://via.placeholder.com/600x400/33FF57/FFFFFF?text=Slide+2',
  'https://via.placeholder.com/600x400/3357FF/FFFFFF?text=Slide+3'
];


const HomePage = () => (
  <div>
    <h1>Welcome to Green Travel Planner</h1>
    <p>Plan your eco-friendly travels with ease.</p>
    <Link to="/itinerary">Get Started</Link>
    <Carousel images={images} />
  </div>
);

export default HomePage;
