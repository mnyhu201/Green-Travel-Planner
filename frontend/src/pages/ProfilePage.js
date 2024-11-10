import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProfilePage.css'

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define the function to fetch user data
  const fetchUserData = async () => {
    setLoading(true);
    const email = localStorage.getItem('email');    
    console.log(localStorage);

    if (!email) {
      setError('No email found in local storage');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4000/user/${email}`);
      setUserData(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching user data');
    } finally {
      setLoading(false);
    }
  };

  // Call fetchUserData on component mount and whenever necessary
  useEffect(() => {
    fetchUserData();
  }, []); // Runs only once after the component mounts

  return (
    <div className="profile-container">
      <h2 className="profile-heading">Profile</h2>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {!loading && userData && (
        <>
          <div className="profile-info">
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Height:</strong> {userData.height} cm</p>
            <p><strong>Weight:</strong> {userData.weight} kg</p>
            <p><strong>Eco Points:</strong> {userData.ecoPoints}</p>
            <p><strong>Activities:</strong> {userData.activities.join(', ')}</p>
          </div>
          <div className="routes-container">
            <h3>Saved Routes</h3>
            {userData.savedRoutes.length > 0 ? (
              <ul>
                {userData.savedRoutes.map((route, index) => (
                  <li key={index}>
                    <p><strong>From:</strong> {route.start}</p>
                    <p><strong>To:</strong> {route.end}</p>
                    <p><strong>Mode:</strong> {route.mode}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No saved routes</p>
            )}

            <h3>Completed Routes</h3>
            {userData.completedRoutes.length > 0 ? (
              <ul>
                {userData.completedRoutes.map((route, index) => (
                  <li key={index}>
                    <p><strong>From:</strong> {route.start}</p>
                    <p><strong>To:</strong> {route.end}</p>
                    <p><strong>Mode:</strong> {route.mode}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No completed routes</p>
            )}
          </div>
          <button onClick={fetchUserData}>Refresh Profile Data</button>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
