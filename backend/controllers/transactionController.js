const axios = require('axios');
const Transaction = require('../models/Transaction');

const initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        await Transaction.deleteMany({});
        await Transaction.insertMany(transactions);

        res.status(200).send('Database initialized successfully');
    } catch (error) {
        res.status(500).send('Error initializing database');
    }
};

const listTransactions = async (req, res) => {
    const { page = 1, perPage = 10, search = '' } = req.query;
    const query = {
        $or: [
            { title: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') },
            { price: new RegExp(search, 'i') },
        ],
    };

    try {
        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).send('Error fetching transactions');
    }
};

const getStatistics = async (req, res) => {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1, 2000`).getMonth();

    try {
        const transactions = await Transaction.find({
            dateOfSale: { $gte: new Date(2000, monthNumber, 1), $lt: new Date(2000, monthNumber + 1, 1) },
        });

        const totalSales = transactions.reduce((sum, transaction) => sum + transaction.price, 0);
        const soldItems = transactions.filter(transaction => transaction.sold).length;
        const notSoldItems = transactions.filter(transaction => !transaction.sold).length;

        res.status(200).json({ totalSales, soldItems, notSoldItems });
    } catch (error) {
        res.status(500).send('Error fetching statistics');
    }
};

const getBarChart = async (req, res) => {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1, 2000`).getMonth();

    try {
        const transactions = await Transaction.find({
            dateOfSale: { $gte: new Date(2000, monthNumber, 1), $lt: new Date(2000, monthNumber + 1, 1) },
        });

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
            if (transaction.price <= 100) priceRanges[0].count++;
            else if (transaction.price <= 200) priceRanges[1].count++;
            else if (transaction.price <= 300) priceRanges[2].count++;
            else if (transaction.price <= 400) priceRanges[3].count++;
            else if (transaction.price <= 500) priceRanges[4].count++;
            else if (transaction.price <= 600) priceRanges[5].count++;
            else if (transaction.price <= 700) priceRanges[6].count++;
            else if (transaction.price <= 800) priceRanges[7].count++;
            else if (transaction.price <= 900) priceRanges[8].count++;
            else priceRanges[9].count++;
        });

        res.status(200).json(priceRanges);
    } catch (error) {
        res.status(500).send('Error fetching bar chart data');
    }
};

const getPieChart = async (req, res) => {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1, 2000`).getMonth();

    try {
        const transactions = await Transaction.find({
            dateOfSale: { $gte: new Date(2000, monthNumber, 1), $lt: new Date(2000, monthNumber + 1, 1) },
        });

        const categoryCount = {};

        transactions.forEach(transaction => {
            if (categoryCount[transaction.category]) {
                categoryCount[transaction.category]++;
            } else {
                categoryCount[transaction.category] = 1;
            }
        });

        const categories = Object.keys(categoryCount).map(category => ({
            category,
            count: categoryCount[category],
        }));

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).send('Error fetching pie chart data');
    }
};

const getCombinedData = async (req, res) => {
    try {
        const [statistics, barChart, pieChart] = await Promise.all([
            getStatistics(req, res),
            getBarChart(req, res),
            getPieChart(req, res),
        ]);

        res.status(200).json({ statistics, barChart, pieChart });
    } catch (error) {
        res.status(500).send('Error fetching combined data');
    }
};

module.exports = {
    initializeDatabase,
    listTransactions,
    getStatistics,
    getBarChart,
    getPieChart,
    getCombinedData,
};
