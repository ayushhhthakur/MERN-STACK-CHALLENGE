// src/components/BarChart.js
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const BarChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const response = await axios.get('/api/transactions/bar-chart?month=March');
        const data = response.data; // Assuming backend returns data in a suitable format for Bar Chart
        setChartData(data);
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      }
    };

    fetchBarChartData();
  }, []);

  return (
    <div>
      <h2>Bar Chart</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default BarChart;
