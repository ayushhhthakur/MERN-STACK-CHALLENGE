const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const Transaction = require('./models/Transaction');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/transactions', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const getMonthRange = (month) => {
    const start = new Date(`2024-${month}-01`);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);
    return { start, end };
};

app.get('/api/init', async (req, res) => {
    try {
        const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await Transaction.insertMany(data);
        res.status(200).send('Database initialized');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/api/transactions', async (req, res) => {
    const { month, search, page = 1, perPage = 10 } = req.query;
    const { start, end } = getMonthRange(month);

    const query = {
        dateOfSale: { $gte: start, $lt: end },
        ...(search && {
            $or: [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { price: new RegExp(search, 'i') },
            ],
        }),
    };

    try {
        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(Number(perPage));
        const total = await Transaction.countDocuments(query);
        res.status(200).json({ transactions, total });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/api/statistics', async (req, res) => {
    const { month } = req.query;
    const { start, end } = getMonthRange(month);

    try {
        const transactions = await Transaction.find({ dateOfSale: { $gte: start, $lt: end } });

        const totalSaleAmount = transactions.reduce((sum, transaction) => sum + (transaction.sold ? transaction.price : 0), 0);
        const totalSoldItems = transactions.filter(transaction => transaction.sold).length;
        const totalNotSoldItems = transactions.filter(transaction => !transaction.sold).length;

        res.status(200).json({ totalSaleAmount, totalSoldItems, totalNotSoldItems });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/api/bar-chart', async (req, res) => {
    const { month } = req.query;
    const { start, end } = getMonthRange(month);

    try {
        const transactions = await Transaction.find({ dateOfSale: { $gte: start, $lt: end } });

        const priceRanges = [
            { range: '0-100', count: 0 },
            { range: '101-200', count: 0 },
            { range: '201-300', count: 0 },
            { range: '301-400', count: 0 },
            { range: '401-500', count: 0 },
            { range: '501-600', count: 0 },
            { range: '601-700', count: 0 },
            { range: '701-800', count: 0 },
            { range: '801-900', count: 0 },
            { range: '901-above', count: 0 },
        ];

        transactions.forEach(transaction => {
            const { price } = transaction;
            if (price <= 100) priceRanges[0].count++;
            else if (price <= 200) priceRanges[1].count++;
            else if (price <= 300) priceRanges[2].count++;
            else if (price <= 400) priceRanges[3].count++;
            else if (price <= 500) priceRanges[4].count++;
            else if (price <= 600) priceRanges[5].count++;
            else if (price <= 700) priceRanges[6].count++;
            else if (price <= 800) priceRanges[7].count++;
            else if (price <= 900) priceRanges[8].count++;
            else priceRanges[9].count++;
        });

        res.status(200).json(priceRanges);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/api/pie-chart', async (req, res) => {
    const { month } = req.query;
    const { start, end } = getMonthRange(month);

    try {
        const transactions = await Transaction.find({ dateOfSale: { $gte: start, $lt: end } });

        const categories = transactions.reduce((acc, transaction) => {
            acc[transaction.category] = (acc[transaction.category] || 0) + 1;
            return acc;
        }, {});

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/api/combined', async (req, res) => {
    const { month } = req.query;

    try {
        const transactionsResponse = await axios.get(`http://localhost:5000/api/transactions?month=${month}`);
        const statisticsResponse = await axios.get(`http://localhost:5000/api/statistics?month=${month}`);
        const barChartResponse = await axios.get(`http://localhost:5000/api/bar-chart?month=${month}`);
        const pieChartResponse = await axios.get(`http://localhost:5000/api/pie-chart?month=${month}`);

        res.status(200).json({
            transactions: transactionsResponse.data,
            statistics: statisticsResponse.data,
            barChart: barChartResponse.data,
            pieChart: pieChartResponse.data,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
