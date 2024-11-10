import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import { auth, createUserWithEmailAndPassword } from '../firebaseConfig';
import './RegisterPage.css'; // Import the CSS file
import axios from 'axios';

const RegisterPage = () => {
  const interestList = [
    { name: 'Sightseeing', id: 0 },
    { name: 'Outdoors', id: 1 },
    { name: 'Food', id: 2 },
    { name: 'Eco-Travel', id: 3 },
    { name: 'Adventure', id: 4 },
    { name: 'Cultural Exploration', id: 5 },
    { name: 'Wellness Retreats', id: 6 },
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    weight: '',
    height: '',
    password: '',
    interest: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelectChange = (selectedList) => {
    setFormData({ ...formData, interest: selectedList });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.interest.length === 0) {
      alert('Please select at least one interest.');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      try{
        const {name, email, city, weight, height, interests} = formData;
        const inputData = {
          "name": name,
          "email": email,
          "height": height,
          "weight": weight,
          "activities": interests,
          "ecoPoints": 0,
          "savedRoutes": [],
          "completedRoutes": []
        }
        const response = await axios.post('http://localhost:4000/register', formData);
      } catch (error) {
        console.error('Error during registration:', error.response ? error.response.data : error.message);
      }
      
      console.log('Form submitted:', formData);
      window.location.href = '/registered';
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('This email is already registered. Please use a different email.');
      } else {
        console.error('Error submitting form:', error);
      }
    }
    localStorage.removeItem('formData');

  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2 className="register-title">Register an Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="city" className="form-label">
              City:
            </label>
            <input
              type="text"
              id="city"
              name="city"
              className="form-input"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="weight" className="form-label">
              Weight in lbs (optional, for calculating calories):
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              className="form-input"
              value={formData.weight}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="height" className="form-label">
              Height in inches (optional, for calculating calories):
            </label>
            <input
              type="number"
              id="height"
              name="height"
              className="form-input"
              value={formData.height}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="interest" className="form-label">
              Interests:
            </label>
            <Multiselect
              options={interestList}
              selectedValues={formData.interest}
              onSelect={handleMultiSelectChange}
              onRemove={handleMultiSelectChange}
              displayValue="name"
              className="form-multiselect"
            />
          </div>

          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
