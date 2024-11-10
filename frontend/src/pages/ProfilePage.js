import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';
import RoutesDisplay from '../components/RouteDisplay';
import ActivityDisplay from '../components/ActivityDisplay';

const ProfilePage = ({  }) => {
    const email = localStorage.getItem('email')
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedActivities, setSelectedActivities] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/user/${email}`);
                setUserData(response.data);
            } catch (err) {
                setError('Error fetching user data');
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

    const handleRemoveActivity = async (activityName) => {
        try {
            await axios.put(`http://localhost:4000/user/${email}/remove-activity`, { name: activityName });
            setUserData((prevData) => ({
                ...prevData,
                activities: prevData.activities.filter(activity => activity.name !== activityName)
            }));
        } catch (err) {
            setError('Error removing activity');
        }
    };

    const handleSelectActivity = (activityName) => {
        setSelectedActivities((prevSelected) => {
            if (prevSelected.includes(activityName)) {
                return prevSelected.filter(name => name !== activityName);
            } else {
                return [...prevSelected, activityName];
            }
        });
    };

    // Get addresses for selected activities
    const getActivityAddresses = () => {
        selectedActivities.forEach(activityName => {
            const activity = userData.activities.find(activity => activity.name === activityName);
            const getActivityAddress = activity ? activity.address : 'Activity not found';
            console.log(`Address for ${activityName}: ${getActivityAddress}`);
        });
    };

    return (
        <div className="profile-container">
            <h2 className="profile-heading">Profile</h2>
            <div className="profile-info">
                <p><strong>Name:</strong> {userData.name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Height:</strong> {userData.height} cm</p>
                <p><strong>Weight:</strong> {userData.weight} kg</p>
                <p><strong>Eco Points:</strong> {userData.ecoPoints}</p>
                <p><strong>Interests:</strong> {userData.interests.join(', ')}</p>
            </div>
            <div className="activities-container">
                <h3>Saved Activities</h3>
                {userData.activities.length > 0 ? (
                    userData.activities.map((activity, index) => (
                        <ActivityDisplay
                            key={index}
                            {...activity}
                            selectedActivities={selectedActivities}
                            setSelectedActivities={setSelectedActivities}
                            onRemove={() => handleRemoveActivity(activity.name)}
                        />
                    ))
                ) : (
                    <p>No activities saved</p>
                )}
            </div>

            {/* <button onClick={getActivityAddresses}>Get Addresses for Selected Activities</button> */}
        </div>
    );
};

export default ProfilePage;
