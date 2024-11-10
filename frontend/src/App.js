import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ItineraryPage from './pages/ItineraryPage';
import TipsPage from './pages/TipsPage';
import AccommodationPage from './pages/AccommodationPage';
import RegisterPage from './pages/RegisterPage';  // Adjust the import to match your folder structure

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
          </Routes>
    </>
  );
}

export default App;
