import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import './RegisterPage.css';
import Multiselect from 'multiselect-react-dropdown';
import { auth, createUserWithEmailAndPassword } from '../firebaseConfig';

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
    email: '',
    city: '',
    weight: '',
    height: '',
    password: '',
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

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      // // Simulate saving formData to userProfile.json
      // const response = await fetch('/userProfile.json', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      // if (!response.ok) {
      //   throw new Error('Failed to save user profile data');
      // }
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
    // window.location.href = '/registered';
    // Handle form submission logic here
    console.log(formData);
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
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
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
          <label htmlFor="weight">Weight in lbs (optional, for calculating calories):</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="height">Height in inches (optional, for calculating calories):</label>
          <input
            type="number"
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

