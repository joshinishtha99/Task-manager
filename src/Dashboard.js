// src/Dashboard.js
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function StatusChart({ completedCount, pendingCount }) {
  const statusData = [
    { name: 'Completed', value: completedCount },
    { name: 'Pending', value: pendingCount }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={statusData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CategoryChart({ tasksByCategory }) {
  const categoryData = Object.entries(tasksByCategory).map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default function Dashboard({ tasks }) {
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  const tasksByCategory = tasks.reduce((acc, task) => {
    const cat = task.category ? task.category.name : 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h2>Task Status</h2>
      <StatusChart completedCount={completedCount} pendingCount={pendingCount} />

      <h2>Tasks by Category</h2>
      <CategoryChart tasksByCategory={tasksByCategory} />
      {/* Add more charts here */}
    </div>
  );
}
