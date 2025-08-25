import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function Dashboard({ tasks }) {
  // Only calculate completed and pending!
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  const statusData = [
    { name: 'Completed', value: completedCount },
    { name: 'Pending', value: pendingCount }
  ];

  return (
    <div>
      <h2>Task Status</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={statusData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
