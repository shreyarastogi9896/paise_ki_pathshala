
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const ExpenseChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/expenses')
      .then(res => {
        console.log("Raw expense data:", res.data);
        const grouped = res.data.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
          return acc;
        }, {});
        const chartData = Object.keys(grouped).map(cat => ({
          category: cat,
          amount: grouped[cat]
        }));
        console.log("Chart data:", chartData);
        setData(chartData);
      })
      .catch(err => console.error('Error loading expenses:', err));
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 500, height: 220,margin: '0 auto' }}>
      <h3 className="text-lg font-medium mb-2 text-center">Expenses by Category</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
          <XAxis dataKey="category" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip formatter={(value) => `₹ ${value.toFixed(2)}`} />
          <Bar dataKey="amount" fill="#82ca9d" barSize={25} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
