import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// sample data
const data = [
  { week: 'Week 1', weight: 100 },
  { week: 'Week 2', weight: 105 },
  { week: 'Week 3', weight: 110 },
  { week: 'Week 4', weight: 115 },
];

const StrengthChart = () => (
  <ResponsiveContainer width="100%" height={400}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="week" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="weight" stroke="#8884d8" />
    </LineChart>
  </ResponsiveContainer>
);

export default StrengthChart;
