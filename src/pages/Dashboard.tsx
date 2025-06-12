import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsCards from '../components/dashboard/StatsCards';
import ParkingGrid from '../components/dashboard/ParkingGrid';
import RecentBookings from '../components/dashboard/RecentBookings';
import EarningsChart from '../components/dashboard/EarningsChart';

const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className={`flex-1 overflow-auto transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <DashboardHeader onLogout={handleLogout} />
        
        <main className="p-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Welcome back, John!</h2>
                <p className="opacity-90 text-lg">Here's what's happening with your parking business today.</p>
              </div>
              <button className="mt-4 md:mt-0 bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-gray-100 focus:outline-none font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
                <span className="flex items-center">
                  <span className="mr-2">+</span> Quick Booking
                </span>
              </button>
            </div>
          </div>

          <StatsCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <EarningsChart />
            </div>
            <div>
              <RecentBookings />
            </div>
          </div>

          <ParkingGrid />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;