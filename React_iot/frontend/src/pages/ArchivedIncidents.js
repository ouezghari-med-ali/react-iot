import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ArchivedIncidents() {
  const [archives, setArchives] = useState([]);

  useEffect(() => {
    fetchArchives();
  }, []);

  const fetchArchives = () => {
    axios.get('http://localhost:8000/api/incident/archives/')
      .then(response => {
        setArchives(response.data);
      })
      .catch(error => {
        console.error('Error fetching archives:', error);
      });
  };

  const exportToCSV = () => {
    // Define CSV headers
    const headers = [
      'ID',
      'Start Date',
      'End Date',
      'Max Temperature (°C)',
      'Alert Count',
      'Acknowledged By'
    ];

    // Convert data to CSV format
    const csvData = archives.map(incident => [
      incident.id,
      new Date(incident.start_date).toLocaleString(),
      new Date(incident.end_date).toLocaleString(),
      incident.max_temperature,
      incident.alert_count,
      incident.acknowledged_by
    ]);

    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `incident_archives_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="archives-page">
      <div className="archives-header">
        <h2>Archived Incidents</h2>
        <button className="export-button" onClick={exportToCSV}>
          Export to CSV
        </button>
      </div>
      <div className="archives-list">
        {archives.map(incident => (
          <div key={incident.id} className="archive-item">
            <h3>Incident Report</h3>
            <p>Start Date: {new Date(incident.start_date).toLocaleString()}</p>
            <p>End Date: {new Date(incident.end_date).toLocaleString()}</p>
            <p>Max Temperature: {incident.max_temperature}°C</p>
            <p>Alert Count: {incident.alert_count}</p>
            <p>Acknowledged By: {incident.acknowledged_by}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArchivedIncidents; 