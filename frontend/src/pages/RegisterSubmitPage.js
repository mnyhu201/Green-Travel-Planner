import React  from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterSubmitPage.css'


const RegisterSubmitPage = () => {
  return (
    <div className="registered-container">
      <h2>Registration Successful</h2>
      <p>Thank you for registering! Your profile has been successfully created, and you are now part of our community.</p>
      <p>You can now explore more personalized content and plan your eco-friendly trips with us.</p>
      <Link to="/profile">Go to Your Profile</Link>
      <br />
      <Link to="/">Go back to Home</Link>
    </div>
  );
};

export default RegisterSubmitPage;
