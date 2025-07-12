import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsCards from '../components/dashboard/StatsCards';
import EarningsChart from '../components/dashboard/EarningsChart';
import UserGrowthChart from '../components/dashboard/UserGrowthChart';
import DailyActivityOverview from '../components/dashboard/DailyActivityOverview';
import ParkingGrid from '../components/dashboard/ParkingGrid';
import { getDashboardData, DashboardData } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data');
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    // Redirect to login page will be handled by the AuthContext
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <DashboardHeader onLogout={handleLogout} />
        <main className="flex-1 p-6 overflow-y-auto">
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="ml-4 text-gray-700">Loading dashboard data...</p>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          {dashboardData && (
            <>
              <StatsCards
                totalUsers={dashboardData?.totalUsers}
                activeSessionsToday={dashboardData?.activeSessionsToday}
                recentUsersChange={dashboardData?.recentUsersChange}
              />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
                <div className="lg:col-span-2">
                  <EarningsChart />
                </div>
                <div>
                  <DailyActivityOverview sessionActivity={dashboardData?.sessionActivity} />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
                <div className="lg:col-span-2">
                  <UserGrowthChart userGrowthData={dashboardData?.userGrowth} />
                </div>
                <div>
                  <ParkingGrid />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
