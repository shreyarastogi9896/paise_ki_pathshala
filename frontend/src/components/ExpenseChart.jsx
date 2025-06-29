
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const ExpenseChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/expenses')
      .then(res => {
        // Group by category and sum amounts
        const grouped = res.data.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
          return acc;
        }, {});
        const chartData = Object.keys(grouped).map(cat => ({
          category: cat,
          amount: grouped[cat]
        }));
        setData(chartData);
      })
      .catch(err => console.error('Error loading expenses:', err));
  }, []);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3 className="text-xl font-semibold mb-2">Expense by Category</h3>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
