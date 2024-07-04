// src/components/BarChart.jsx
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { getBarChart } from '../services/api';

const BarChart = ({ month }) => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const data = await getBarChart(month);
            console.log('BarChart data:', data);
            setChartData({
                labels: data ? data.map(d => d.range) : [],
                datasets: [
                    {
                        label: '# of Items',
                        data: data ? data.map(d => d.count) : [],
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    },
                ],
            });
        };
        fetchData();
    }, [month]);

    return (
        <div>
            <h3>Bar Chart</h3>
            {chartData.labels && chartData.labels.length > 0 ? (
                <Bar data={chartData} />
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default BarChart;
