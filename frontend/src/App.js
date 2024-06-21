// src/App.js
import React from 'react';
import TransactionTable from './components/TransactionTable';
import PieChart from './components/PieChart';
import BarChart from './components/BarChart';

function App() {
  return (
    <div className="App">
      <h1>Financial Dashboard</h1>
      <div className="charts">
        <PieChart />
        <BarChart />
      </div>
      <TransactionTable />
    </div>
  );
}

export default App;
