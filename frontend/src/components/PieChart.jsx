// src/components/PieChart.jsx
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { getPieChart } from '../services/api';

const PieChart = ({ month }) => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const data = await getPieChart(month);
            console.log('PieChart data:', data);
            setChartData({
                labels: data ? Object.keys(data) : [],
                datasets: [
                    {
                        label: '# of Items',
                        data: data ? Object.values(data) : [],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                        ],
                    },
                ],
            });
        };
        fetchData();
    }, [month]);

    return (
        <div>
            <h3>Pie Chart</h3>
            {chartData.labels && chartData.labels.length > 0 ? (
                <Pie data={chartData} />
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default PieChart;
