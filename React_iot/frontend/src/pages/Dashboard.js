import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard({ lastData, allData }) {
  return (
    <div className="dashboard">
      <h2>Current Status</h2>
      {lastData && (
        <div className="current-readings">
          <div className="reading">
            <span className="label">Temperature</span>
            <span className="value">{lastData.temp}°C</span>
          </div>
          <div className="reading">
            <span className="label">Humidity</span>
            <span className="value">{lastData.hum}%</span>
          </div>
          <div className="reading">
            <span className="label">Last Updated</span>
            <span className="value">{new Date(lastData.date).toLocaleString()}</span>
          </div>
        </div>
      )}

      <h2>Recent Readings</h2>
      <div className="readings-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Temperature</th>
              <th>Humidity</th>
            </tr>
          </thead>
          <tbody>
            {allData.slice(-5).map((reading, index) => (
              <tr key={index}>
                <td>{new Date(reading.date).toLocaleString()}</td>
                <td>{reading.temp}°C</td>
                <td>{reading.hum}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard; 