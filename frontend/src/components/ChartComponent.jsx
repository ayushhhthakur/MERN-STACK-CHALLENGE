import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js';

const ChartComponent = ({ data, options, type }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
            chartInstanceRef.current = new Chart(chartRef.current, {
                type,
                data,
                options,
            });
        }
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [data, options, type]);

    return <canvas ref={chartRef} />;
};

export default ChartComponent;
