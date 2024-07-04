// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    dateOfSale: Date,
    title: String,
    description: String,
    price: Number,
    category: String,
    sold: Boolean
});

module.exports = mongoose.model('Transaction', transactionSchema);
