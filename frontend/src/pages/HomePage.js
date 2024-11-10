import React, { useEffect, useState }  from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const HomePage = () => {
  const navigate = useNavigate();
  const [ecopoints, setEcopoints] = useState(0);
  const [completedroutes, setCompletedroutes] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const [chartData, setChartData] = useState(null);

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
          
          const top3 = users.slice(0, 3);
          setTopUsers(top3);
          
          // Find the current user’s data and rank based on sorted list
          const userIndex = users.findIndex(user => user.email === email);
          console.log("userIndex: ", userIndex);
          if (userIndex !== -1) {
            setRanking(userIndex + 1);
            setEcopoints(users[userIndex].ecoPoints);
            setCompletedroutes(users[userIndex].completedRoutes.length);
          }
          // Prepare chart data for EcoPoints only
          const ecoPoints = users.map(user => user.ecoPoints);
          const userEcoPoints = users[userIndex]?.ecoPoints;

          setChartData({
            labels: top3.map(user => user.email), // Display the top 3 users
            datasets: [
              {
                label: 'EcoPoints',
                data: [userEcoPoints, ...ecoPoints.slice(0, 3)], // User's EcoPoints followed by top 3 users' EcoPoints
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(153, 102, 255, 0.6)'],
              }
            ]
          });

        })
        .catch(error => {
          console.error('Error fetching user ranking data:', error);
        });
    }
  }, [navigate]);

  return (
    <div className="home-container">
      <div className="header">
        <h1>Welcome to Green Travel Planner</h1>
      </div>
      
      <div className="main-content">
        <div className="left-section">
          <p>Plan your eco-friendly travels with ease.</p>
          <Link to="/itinerary" className="get-started-btn">Get Started</Link>
        </div>

        <div className="right-section">
          {ecopoints !== null ? (
            <>
              <div className="user-info">
                <h2>Your Info</h2>
                <p><strong>Your EcoPoints:</strong> {ecopoints}</p>
                <p><strong>Completed Routes:</strong> {completedroutes}</p>
                <p><strong>Your Ranking:</strong> {ranking}</p>
              </div>

              {chartData && (
                <div className="chart">
                  <h2>Your EcoPoints vs Top 3 Users</h2>
                  <Bar data={chartData} options={{
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: 'EcoPoints Comparison'
                      },
                      legend: {
                        position: 'top',
                      }
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                      }
                    }
                  }} />
                </div>
              )}
            </>
          ) : (
            <p>Loading your EcoPoints and Ranking...</p>
          )}
        </div>
      </div>
    </div>
  );

};

export default HomePage;
