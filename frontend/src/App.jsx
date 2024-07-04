// src/App.jsx
import React, { useState } from 'react';
import TransactionsTable from './components/TransactionTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [month, setMonth] = useState('03');

    const handleMonthChange = (e) => {
        setMonth(e.target.value);
    };

    return (
        <div className="container">
            <h1>Transactions Dashboard</h1>
            <div className="form-group">
                <label htmlFor="monthSelect">Select Month</label>
                <select id="monthSelect" className="form-control" value={month} onChange={handleMonthChange}>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
            </div>
            <TransactionsTable month={month} />
            <Statistics month={month} />
            <BarChart month={month} />
            <PieChart month={month} />
        </div>
    );
};

export default App;
