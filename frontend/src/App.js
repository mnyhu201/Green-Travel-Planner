import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ItineraryPage from './pages/ItineraryPage';
import RegisterPage from './pages/RegisterPage';
import RegisterSubmitPage from './pages/RegisterSubmitPage';
import SignInPage from './pages/SignInPage';

function App() {
  return (
    <>
        <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/itinerary" element={<ItineraryPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/registered" element={<RegisterSubmitPage />} />
            <Route path="/signin" element={<SignInPage />} />
          </Routes>
    </>
      

  );
}

export default App;
