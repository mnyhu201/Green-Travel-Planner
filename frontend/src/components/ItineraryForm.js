import React, { useState } from 'react';

const ItineraryForm = () => {
  const [formData, setFormData] = useState({
    destination: '',
    budget: '',
    travelType: 'eco-friendly',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted', formData);
    // Logic for generating itineraries goes here
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Destination:</label>
      <input type="text" name="destination" onChange={handleChange} />
      <label>Budget:</label>
      <input type="number" name="budget" onChange={handleChange} />
      <button type="submit">Create Itinerary</button>
    </form>
  );
};

export default ItineraryForm;
