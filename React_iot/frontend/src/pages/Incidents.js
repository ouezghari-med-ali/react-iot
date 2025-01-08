import React, { useState } from 'react';
import axios from 'axios';

function Incidents({ incidentStatus, lastData }) {
  const [acknowledger, setAcknowledger] = useState('');

  const handleAcknowledge = () => {
    if (!acknowledger.trim()) {
      alert('Please enter your name');
      return;
    }

    axios.post('http://localhost:8000/api/incident/acknowledge/', {
      start_date: incidentStatus.start_date,
      acknowledged_by: acknowledger
    })
    .then(response => {
      alert('Incident acknowledged and archived');
      setAcknowledger('');
    })
    .catch(error => {
      console.error('Error acknowledging incident:', error);
      alert('Error acknowledging incident');
    });
  };

  return (
    <div className="incidents-page">
      <h2>Incident Status</h2>
      {incidentStatus ? (
        <div className={`incident-status ${incidentStatus.incident ? 'active' : 'inactive'}`}>
          <p className="status">
            {incidentStatus.incident ? 'INCIDENT ACTIVE' : 'NO ACTIVE INCIDENT'}
          </p>
          <div className="current-temp">
            <p>Current Temperature: {lastData?.temp}°C</p>
            <p>Threshold: 10°C</p>
          </div>
          {incidentStatus.incident && (
            <>
              <p>Started: {incidentStatus.start_date}</p>
              <p>Alert Count: {incidentStatus.compteur}</p>
              <div className="acknowledge-form">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={acknowledger}
                  onChange={(e) => setAcknowledger(e.target.value)}
                />
                <button onClick={handleAcknowledge}>Acknowledge Incident</button>
              </div>
            </>
          )}
        </div>
      ) : (
        <p>Loading incident status...</p>
      )}
    </div>
  );
}

export default Incidents; 