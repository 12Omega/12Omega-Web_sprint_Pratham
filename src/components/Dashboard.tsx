import React, { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface DashboardData {
  totalUsers: number;
  activeSessions: number;
  recentUsers: number;
  userGrowth: { date: string; count: number }[];
  sessionActivity: { date: string; activeSessions: number }[];
  userRole: 'admin' | 'manager' | 'host';
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(
    format(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );

  const fetchData = useCallback(() => {
    setLoading(true);
    // setError(null); // Optional: clear previous error
    fetch(`/api/dashboard/history?start=${startDate}&end=${endDate}`)
      .then((res) => res.json())
      .then((resData: DashboardData) => { // Renamed res to resData to avoid conflict if setError(null) is uncommented above
        setData(resData);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, [fetchData]); // fetchData is now a stable dependency

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return null;

  const {
    totalUsers,
    activeSessions,
    recentUsers,
    userGrowth,
    sessionActivity,
    userRole,
  } = data;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dashboard ({userRole})</h2>

      {/* Date Filters */}
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Start Date:{' '}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label style={{ marginLeft: '1rem' }}>
          End Date:{' '}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>

      {/* Shared Metrics */}
      <div>
        <p>Total Users: {totalUsers}</p>
        <p>Active Sessions: {activeSessions}</p>
        <p>New Users: {recentUsers}</p>
      </div>

      {/* Admin View */}
      {userRole === 'admin' && (
        <>
          <h3>User Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userGrowth}>
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}

      {/* Manager View */}
      {userRole === 'manager' && (
        <>
          <h3>Session Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sessionActivity}>
              <Bar dataKey="activeSessions" fill="#82ca9d" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      {/* Host View */}
      {userRole === 'host' && (
        <div>
          <p>Welcome, Host! Your parking session stats will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;





