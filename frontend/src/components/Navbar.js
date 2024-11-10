import React, { useState, useEffect  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  const checkAuthentication = () => {
    // Check if token exists in local storage
    const token = localStorage.getItem('idToken');
    setIsAuthenticated(!!token); // Set to true if token exists, otherwise false
  };

  useEffect(() => {
    // Check authentication on component mount
    checkAuthentication();

    // Listen for storage changes to detect authentication changes
    const handleStorageChange = () => {
      checkAuthentication();
    };

    window.addEventListener('storage', handleStorageChange);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  });
  // useEffect(() => {
  //   // Check authentication on component mount
  //   checkAuthentication();
  // }, []); 

  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSignOut = () => {
    // Remove the token from local storage and update the authentication state
    localStorage.removeItem('idToken');
    setIsAuthenticated(false);
    navigate('/');  // Redirect to the homepage after signing out
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
              {!isAuthenticated ? (
                <>
                  <li><Link to="/signin">Sign In</Link></li>
                  <li><Link to="/register">Register</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/profile">Profile</Link></li>
                  <li onClick={handleSignOut}><Link to="#">Sign Out</Link></li>
                </>
              )}
                {/* <li><Link to="/signin">Sign In</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li onClick={handleSignOut}><Link to="#">Sign Out</Link></li> */}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;