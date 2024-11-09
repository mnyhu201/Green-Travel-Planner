import React from 'react';

const AccommodationPage = () => {
  const accommodations = [
    { name: 'Eco Lodge Paradise', location: 'Costa Rica', rating: 4.8 },
    { name: 'Green Stay Hotel', location: 'Sweden', rating: 4.5 },
    { name: 'Sustainable Suites', location: 'New Zealand', rating: 4.7 },
  ];

  return (
    <div>
      <h2>Eco-Friendly Accommodations</h2>
      <ul>
        {accommodations.map((accommodation, index) => (
          <li key={index}>
            <strong>{accommodation.name}</strong> - {accommodation.location} (Rating: {accommodation.rating})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccommodationPage;
