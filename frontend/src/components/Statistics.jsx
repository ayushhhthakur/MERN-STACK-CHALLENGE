// src/components/Statistics.jsx
import React, { useState, useEffect } from 'react';
import { getStatistics } from '../services/api';

const Statistics = ({ month }) => {
    const [stats, setStats] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const data = await getStatistics(month);
            setStats(data);
        };
        fetchData();
    }, [month]);

    return (
        <div>
            <h3>Statistics</h3>
            <p>Total Sale Amount: {stats.totalSaleAmount}</p>
            <p>Total Sold Items: {stats.totalSoldItems}</p>
            <p>Total Not Sold Items: {stats.totalNotSoldItems}</p>
        </div>
    );
};

export default Statistics;
