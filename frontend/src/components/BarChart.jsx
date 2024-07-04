import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data) {
      const chart = {
        labels: data.map(item => item.label),
        datasets: [
          {
            label: 'Data',
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
            data: data.map(item => item.value),
          },
        ],
      };
      setChartData(chart);
    }
  }, [data]);

  return (
    <div className="chart-container">
      {chartData && (
        <Bar
          data={chartData}
          options={{
            scales: {
              x: {
                type: 'category',
                position: 'bottom',
              },
              y: {
                type: 'linear',
                min: 0,
                max: 100,
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default BarChart;
