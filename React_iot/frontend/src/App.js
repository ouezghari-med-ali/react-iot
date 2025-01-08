import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import './App.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import { enUS } from 'date-fns/locale';
import 'chartjs-adapter-date-fns';

import Dashboard from './pages/Dashboard';
import TemperatureChart from './pages/TemperatureChart';
import HumidityChart from './pages/HumidityChart';
import Incidents from './pages/Incidents';
import ArchivedIncidents from './pages/ArchivedIncidents';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

function App() {
  const [lastData, setLastData] = useState(null);
  const [incidentStatus, setIncidentStatus] = useState(null);
  const [allData, setAllData] = useState([]);
  const [timeRange, setTimeRange] = useState('24h'); // '24h', '3d', '7d', '15d'

  // Fetch all data
  const fetchAllData = () => {
    axios.get("http://localhost:8000/api/data/")
      .then((response) => {
        setAllData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching all data:", error);
      });
  };

  // Fetch incident status
  const fetchIncidentStatus = () => {
    axios.get("http://localhost:8000/api/incident/status/")
      .then((response) => {
        console.log("Incident status response:", response.data);
        setIncidentStatus(response.data);
      })
      .catch((error) => {
        console.error("Error fetching incident status:", error);
      });
  };

  // Fetch last data
  const fetchLastData = () => {
    axios.get("http://localhost:8000/api/data/last/")
      .then((response) => {
        console.log("Last data response:", response.data);
        setLastData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching last data:", error);
      });
  };

  // Filter data based on time range
  const getFilteredData = () => {
    const now = new Date();
    const filtered = allData.filter(reading => {
      const readingDate = new Date(reading.date);
      switch (timeRange) {
        case '24h':
          return now - readingDate <= 24 * 60 * 60 * 1000;
        case '3d':
          return now - readingDate <= 3 * 24 * 60 * 60 * 1000;
        case '7d':
          return now - readingDate <= 7 * 24 * 60 * 60 * 1000;
        case '15d':
          return now - readingDate <= 15 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });
    return filtered;
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        type: 'time',
        adapters: {
          date: {
            locale: enUS
          }
        },
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'HH:mm'
          }
        },
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value'
        }
      }
    }
  };

  // Prepare chart data
  const getChartData = (dataType) => {
    const filteredData = getFilteredData();
    return {
      datasets: [
        {
          label: dataType === 'temp' ? 'Temperature (°C)' : 'Humidity (%)',
          data: filteredData.map(reading => ({
            x: new Date(reading.date),
            y: reading[dataType]
          })),
          borderColor: dataType === 'temp' ? 'rgb(255, 99, 132)' : 'rgb(53, 162, 235)',
          backgroundColor: dataType === 'temp' ? 'rgba(255, 99, 132, 0.5)' : 'rgba(53, 162, 235, 0.5)',
          tension: 0.1
        }
      ]
    };
  };

  useEffect(() => {
    fetchLastData();
    fetchIncidentStatus();
    fetchAllData();

    const interval = setInterval(() => {
      fetchLastData();
      fetchIncidentStatus();
      fetchAllData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <Link to="/">Dashboard</Link>
          <Link to="/temperature">Temperature</Link>
          <Link to="/humidity">Humidity</Link>
          <Link to="/incidents">Incidents</Link>
          <Link to="/archives">Archives</Link>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/" element={
              <Dashboard 
                lastData={lastData} 
                allData={allData} 
              />
            } />
            <Route path="/temperature" element={
              <TemperatureChart 
                timeRange={timeRange}
                setTimeRange={setTimeRange}
                chartOptions={chartOptions}
                getChartData={getChartData}
              />
            } />
            <Route path="/humidity" element={
              <HumidityChart 
                timeRange={timeRange}
                setTimeRange={setTimeRange}
                chartOptions={chartOptions}
                getChartData={getChartData}
              />
            } />
            <Route path="/incidents" element={
              <Incidents 
                incidentStatus={incidentStatus}
                lastData={lastData}
              />
            } />
            <Route path="/archives" element={<ArchivedIncidents />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
