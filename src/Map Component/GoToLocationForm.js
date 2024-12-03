// src/App/GoToLocationForm.js
import React, { useState } from 'react';
import '../styles/GoToLocationForm.css';

const GoToLocationForm = ({ onGoToLocation, onClose, onClearMarkers }) => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleGoTo = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setErrorMessage('Invalid coordinates. Latitude must be between -90 and 90, and Longitude between -180 and 180.');
      return;
    }

    // Clear error message and proceed
    setErrorMessage('');
    onGoToLocation({ lat, lng });
  };

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  return (
    <div className="goto-location-form">
      <h3>Go To Location</h3>
      <div className="input-group">
        <input
          type="text"
          placeholder="Latitude (-90 to 90)"
          value={latitude}
          onChange={handleInputChange(setLatitude)}
        />
        <input
          type="text"
          placeholder="Longitude (-180 to 180)"
          value={longitude}
          onChange={handleInputChange(setLongitude)}
        />
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
      <div className="form-buttons">
        <button onClick={handleGoTo} className="btn-go-to small-button">Go To</button>
        <button onClick={onClearMarkers} className="btn-clear small-button">Clear All Markers</button>
        <button onClick={onClose} className="btn-cancel small-button">Cancel</button>
      </div>
    </div>
  );
};

export default GoToLocationForm;
