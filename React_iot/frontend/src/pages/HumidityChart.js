import React from 'react';
import { Line } from 'react-chartjs-2';

function HumidityChart({ timeRange, setTimeRange, chartOptions, getChartData }) {
  return (
    <div className="chart-page">
      <h2>Humidity History</h2>
      
      <div className="time-range-selector">
        <button className={timeRange === '24h' ? 'active' : ''} onClick={() => setTimeRange('24h')}>24h</button>
        <button className={timeRange === '3d' ? 'active' : ''} onClick={() => setTimeRange('3d')}>3 days</button>
        <button className={timeRange === '7d' ? 'active' : ''} onClick={() => setTimeRange('7d')}>7 days</button>
        <button className={timeRange === '15d' ? 'active' : ''} onClick={() => setTimeRange('15d')}>15 days</button>
      </div>

      <div className="chart-container">
        <Line options={chartOptions} data={getChartData('hum')} />
      </div>
    </div>
  );
}

export default HumidityChart; 