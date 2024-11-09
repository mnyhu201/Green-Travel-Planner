import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ItineraryPage from './pages/ItineraryPage';
import TipsPage from './pages/TipsPage';
import AccommodationPage from './pages/AccommodationPage';

function App() {
  return (
    <>
        <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/itinerary" element={<ItineraryPage />} />
            <Route path="/tips" element={<TipsPage />} />
            <Route path="/accommodations" element={<AccommodationPage />} />
          </Routes>
    </>
      

  );
}

export default App;
