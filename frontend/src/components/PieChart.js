// src/components/PieChart.js
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

const PieChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchPieChartData = async () => {
      try {
        const response = await axios.get('/api/transactions/pie-chart?month=March');
        const data = response.data; // Assuming backend returns data in a suitable format for Pie Chart
        setChartData(data);
      } catch (error) {
        console.error('Error fetching pie chart data:', error);
      }
    };

    fetchPieChartData();
  }, []);

  return (
    <div>
      <h2>Pie Chart</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;
