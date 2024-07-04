// src/components/TransactionTable.jsx
import React, { useState, useEffect } from 'react';
import { getTransactions } from '../services/api';

const TransactionTable = ({ month }) => {
    const [transactions, setTransactions] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchTransactions = async () => {
            const data = await getTransactions(month, page, 10, search);
            setTransactions(data.transactions);
            setTotal(data.total);
        };
        fetchTransactions();
    }, [month, page, search]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    return (
        <div>
            <h3>Transactions Table</h3>
            <input
                type="text"
                placeholder="Search transactions"
                value={search}
                onChange={handleSearchChange}
            />
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Date of Sale</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.title}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.price}</td>
                            <td>{transaction.dateOfSale}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
            </button>
            <button disabled={transactions.length < 10} onClick={() => setPage(page + 1)}>
                Next
            </button>
        </div>
    );
};

export default TransactionTable;
