import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import './RegisterPage.css';
import Multiselect from 'multiselect-react-dropdown';

const RegisterPage = () => {
  const interestList = [
    { name: 'Sightseeing', id: 0 },
    { name: 'Outdoors', id: 1 },
    { name: 'Food', id: 2 },
    { name: 'Eco-Travel', id: 3 },
    { name: 'Adventure', id: 4 },
    { name: 'Cultural Exploration', id: 5 },
    { name: 'Wellness Retreats', id: 6 }
  ];

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    weight: '',
    height: '',
    interest: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelectChange = (selectedList) => {
    setFormData({ ...formData, interest: selectedList });
  };

  const DESTINATION = "";
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.interest.length === 0) {
      alert('Please select at least one interest.');
      return;
    }
    try {
      // Simulate saving formData to userProfile.json
      const response = await fetch(DESTINATION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to save user profile data');
      }
      console.log('Form submitted:', formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="register-container">
      <h2>Register an Account</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="weight">Weight (optional):</label>
          <input
            type="text"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="height">Height (optional):</label>
          <input
            type="text"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="interest">Interests:</label>
          <Multiselect
            options={interestList} // Options to display in the dropdown
            selectedValues={formData.interest} // Preselected value to persist in dropdown
            onSelect={handleMultiSelectChange} // Function will trigger on select event
            onRemove={handleMultiSelectChange} // Function will trigger on remove event
            displayValue="name" // Property name to display in the dropdown options
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;

