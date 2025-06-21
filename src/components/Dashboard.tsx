import React, { useEffect, useState } from 'react';
import { DashboardData } from '../services/api';

import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

interface DashboardWithHistoryData extends DashboardData {
  // Sample data for charts
  userGrowth: { date: string; count: number }[];
  sessionActivity: { date: string; activeSessions: number }[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardWithHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/history') // new endpoint for historical data
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch dashboard data');
        return res.json();
      })
      .then((res: DashboardWithHistoryData) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Error fetching data');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading dashboard data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <p>Total Users: {data?.totalUsers}</p>
        <p>Active Sessions: {data?.activeSessions}</p>
        <p>New Users (last 7 days): {data?.recentUsers}</p>
      </div>

      <h3>User Growth (last 7 days)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data?.userGrowth}>
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>

      <h3>Active Sessions (last 7 days)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data?.sessionActivity}>
          <Bar dataKey="activeSessions" fill="#82ca9d" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;

