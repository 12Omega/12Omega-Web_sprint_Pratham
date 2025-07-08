import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardData, DashboardData } from '../services/api'; // Corrected path
import StatsCards from '../components/dashboard/StatsCards';
import ParkingGrid from '../components/dashboard/ParkingGrid';
import DailyActivityOverview from '../components/dashboard/DailyActivityOverview'; // Updated import
import UserGrowthChart from '../components/dashboard/UserGrowthChart';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Example: Fetch data for the last 7 days by default
        // const endDate = new Date();
        // const startDate = new Date();
        // startDate.setDate(endDate.getDate() - 7);
        // const data = await getDashboardData(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
        
        // For now, fetching without date params to use backend defaults
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

  const displayName = user?.firstName || user?.username || 'User';
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-700">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }
  
  return (
    <div>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 md:p-8 mb-6 md:mb-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Welcome back, {displayName}!</h2>
            <p className="opacity-90 text-sm md:text-lg">Here's what's happening with your business today.</p>
          </div>
          <button 
            className="mt-4 md:mt-0 bg-white text-blue-600 px-5 py-2.5 rounded-lg hover:bg-gray-100 focus:outline-none font-medium transition-all duration-200 transform hover:scale-105 shadow-md text-sm md:text-base"
            // onClick={() => { /* Add quick booking action if needed */ }}
          >
            <span className="flex items-center justify-center">
              <span className="mr-2 text-lg">+</span> Quick Action
            </span>
          </button>
        </div>
      </div>

      <StatsCards 
        totalUsers={dashboardData?.totalUsers}
        activeSessionsToday={dashboardData?.activeSessionsToday}
        recentUsersChange={dashboardData?.recentUsersChange}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 my-6 md:my-8">
        <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">User Growth Overview</h3>
          <UserGrowthChart userGrowthData={dashboardData?.userGrowth} />
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Daily Active Sessions</h3>
          <DailyActivityOverview sessionActivity={dashboardData?.sessionActivity} />
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Parking Availability</h3>
        <ParkingGrid />
      </div>
    </div>
  );
};

export default DashboardPage;
