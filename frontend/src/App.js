import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ItineraryPage from './pages/ItineraryPage';
import TipsPage from './pages/TipsPage';
import AccommodationPage from './pages/AccommodationPage';
import RegisterPage from './pages/RegisterPage';
import RegisterSubmitPage from './pages/RegisterSubmitPage';
import SignInPage from './pages/SignInPage';
import ProfilePage from './pages/ProfilePage';
import { locals } from '../../backend/app';

function App() {
  return (
    <>
        <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/itinerary" element={<ItineraryPage />} />
            <Route path="/tips" element={<TipsPage />} />
            <Route path="/accommodations" element={<AccommodationPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/registered" element={<RegisterSubmitPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/profile" element={<ProfilePage email={localStorage.getItem('email')} />} />
          </Routes>
    </>
      

  );
}

export default App;
