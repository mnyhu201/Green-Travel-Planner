import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = ({ email }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/user/${email}`);
                setUserData(response.data);
            } catch (err) {
                setError('Error fetching user data');
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [email]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="profile-container">
            <h2 className="profile-heading">Profile</h2>
            <div className="profile-info">
                <p><strong>Name:</strong> {userData.name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Height:</strong> {userData.height} cm</p>
                <p><strong>Weight:</strong> {userData.weight} kg</p>
                <p><strong>Eco Points:</strong> {userData.ecoPoints}</p>
                <p><strong>Interests:</strong> {userData.interests}</p>
                <h3><strong>Activities:</strong></h3>
                {userData.activities.length > 0 ? (
                    <ul>
                        {userData.activities.map((activity, index) => (
                            <li key={index}>
                                <p><strong>Name:</strong> {activity.name}</p>
                                <p><strong>Address:</strong> {activity.address}</p>
                                <p><strong>Hours:</strong> {activity.hours}</p>
                                <p><strong>Rating:</strong> {activity.rating}</p>
                                <p><strong>Phone:</strong> {activity.phone}</p>
                                <img src={activity.imageLinks} alt={activity.name} className="activity-image" />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No activities saved</p>
                )}
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
        </div>
    );
};

export default ProfilePage;
