// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Replace with your actual backend URL
});

export const getBarChart = async (month) => {
    try {
        const response = await api.get(`/bar-chart?month=${month}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching bar chart data:', error);
        return [];
    }
};

export const getPieChart = async (month) => {
    try {
        const response = await api.get(`/pie-chart?month=${month}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pie chart data:', error);
        return {};
    }
};

export const getTransactions = async (month, page = 1, perPage = 10, search = '') => {
    try {
        const response = await api.get('/transactions', {
            params: {
                month,
                page,
                perPage,
                search,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return { transactions: [], total: 0 };
    }
};

export const getStatistics = async (month) => {
    try {
        const response = await api.get(`/statistics?month=${month}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching statistics:', error);
        return { totalSaleAmount: 0, totalSoldItems: 0, totalNotSoldItems: 0 };
    }
};

export const getCombinedData = async (month) => {
    try {
        const response = await api.get('/combined', { params: { month } });
        return response.data;
    } catch (error) {
        console.error('Error fetching combined data:', error);
        return {};
    }
};
