import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/itinerary">Itinerary</Link></li>
      <li><Link to="/tips">Travel Tips</Link></li>
      <li><Link to="/accommodations">Eco Accommodations</Link></li>
    </ul>
  </nav>
);

export default Navbar;
