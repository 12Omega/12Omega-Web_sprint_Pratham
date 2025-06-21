import React, { useEffect, useState } from 'react';
import { fetchDashboardData, DashboardData } from '../services/api';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData()
      .then((res) => {
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
    </div>
  );
};

export default Dashboard;
