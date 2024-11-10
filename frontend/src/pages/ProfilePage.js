import React from 'react';
import './ProfilePage.css';

const ProfilePage = ({ user }) => {
  return (
    <div className="profile-container">
      <h2 className="profile-heading">Profile</h2>
      <div className="profile-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Height:</strong> {user.height} cm</p>
        <p><strong>Weight:</strong> {user.weight} kg</p>
        <p><strong>Eco Points:</strong> {user.ecoPoints}</p>
        <p><strong>Activities:</strong> {user.activities.join(', ')}</p>
      </div>
      <div className="routes-container">
        <h3>Saved Routes</h3>
        {user.savedRoutes.length > 0 ? (
          <ul>
            {user.savedRoutes.map((route, index) => (
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
        {user.completedRoutes.length > 0 ? (
          <ul>
            {user.completedRoutes.map((route, index) => (
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
    </div>
  );
};

export default ProfilePage;
