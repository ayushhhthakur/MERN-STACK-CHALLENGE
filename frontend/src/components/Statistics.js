import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = ({ month }) => {
    const [statistics, setStatistics] = useState({
        totalSales: 0,
        soldItems: 0,
        notSoldItems: 0,
    });

    useEffect(() => {
        fetchStatistics();
    }, [month]);

    const fetchStatistics = async () => {
        try {
            const response = await axios.get('/api/transactions/statistics', {
                params: { month },
            });
            setStatistics(response.data);
        } catch (error) {
            console.error('Error fetching statistics', error);
        }
    };

    return (
        <div>
            <h3>Statistics for {month}</h3>
            <p>Total Sales: ${statistics.totalSales}</p>
            <p>Sold Items: {statistics.soldItems}</p>
            <p>Not Sold Items: {statistics.notSoldItems}</p>
        </div>
    );
};

export default Statistics;
