import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/itinerary">Itinerary</Link></li>
        <li><Link to="/tips">Travel Tips</Link></li>
        <li><Link to="/accommodations">Eco Accommodations</Link></li>
        <li 
          className="dropdown"
          onMouseEnter={toggleDropdown}
          onMouseLeave={toggleDropdown}
        >
          <span>Accounts</span>
          {showDropdown && (
            <ul className="dropdown-menu">
              <li><Link to="/signin">Sign In</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;