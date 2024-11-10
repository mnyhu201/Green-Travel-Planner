import React, { useEffect, useState }  from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();
  const [ecopoints, setEcopoints] = useState(0);
  const [completedroutes, setCompletedroutes] = useState(null);
  const [ranking, setRanking] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('idToken');
    const email = localStorage.getItem('email');
    
    if (!token) {
      navigate('/signin');
    } else if (email) {
      // Fetch all user data for ranking
      axios.get(`http://localhost:4000/pointsroutes`)
        .then(response => {
          const users = response.data;
          console.log("users: ", users);
          
          // Find the current user’s data and rank based on sorted list
          const userIndex = users.findIndex(user => user.email === email);
          console.log("userIndex: ", userIndex);
          if (userIndex !== -1) {
            setRanking(userIndex + 1);
            setEcopoints(users[userIndex].ecoPoints);
            setCompletedroutes(users[userIndex].completedRoutes.length);
          }
        })
        .catch(error => {
          console.error('Error fetching user ranking data:', error);
        });
    }
  }, [navigate]);

  return (
    <div>
      <h1>Welcome to Green Travel Planner</h1>
      <p>Plan your eco-friendly travels with ease.</p>
      {ecopoints !== null ? (
        <>
          <p>Your EcoPoints: {ecopoints}</p>
          <p>Completed Routes: {completedroutes}</p>
          <p>Your Ranking: {ranking}</p>
        </>
      ) : (
        <p>Loading your EcoPoints and Ranking...</p>
      )}
      <Link to="/itinerary">Get Started</Link>
    </div>
  );

};

export default HomePage;
