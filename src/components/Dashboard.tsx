import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(format(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  const fetchData = () => {
    setLoading(true);
    fetch(`/api/dashboard/history?start=${startDate}&end=${endDate}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch dashboard data');
        return res.json();
      })
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Error fetching data');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  if (loading) return <p>Loading dashboard data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Dashboard</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Start Date: <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label style={{ marginLeft: '1rem' }}>
          End Date: <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
      </div>

      <div>
        <p>Total Users: {data?.totalUsers}</p>
        <p>Active Sessions: {data?.activeSessions}</p>
        <p>New Users: {data?.recentUsers}</p>
      </div>

      <h3>User Growth</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data?.userGrowth}>
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>

      <h3>Active Sessions</h3>
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

