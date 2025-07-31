import React from 'react';
import { Users, Wifi, TrendingUp, TrendingDown, Calendar, Clock } from 'lucide-react';

interface StatsCardsProps {
  totalUsers?: number;
  activeSessionsToday?: number;
  recentUsersChange?: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  totalUsers = 0,
  activeSessionsToday = 0,
  recentUsersChange = 0,
}) => {
  // Get current date for display
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Get current time for display
  const formattedTime = today.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Active Sessions',
      value: activeSessionsToday.toLocaleString(),
      icon: Wifi,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'User Growth',
      value: `${recentUsersChange > 0 ? '+' : ''}${recentUsersChange.toFixed(1)}%`,
      icon: recentUsersChange >= 0 ? TrendingUp : TrendingDown,
      color: recentUsersChange >= 0 ? 'emerald' : 'red',
      bgColor: recentUsersChange >= 0 ? 'bg-emerald-50' : 'bg-red-50',
      textColor: recentUsersChange >= 0 ? 'text-emerald-700' : 'text-red-700'
    },
    {
      title: 'Current Date',
      value: formattedDate,
      subtitle: formattedTime,
      icon: Calendar,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <h3 className={`text-2xl font-bold ${stat.textColor} mt-1`}>{stat.value}</h3>
              {stat.subtitle && (
                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              )}
            </div>
            <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.textColor}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
          
          {index === 2 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center">
                <span className="text-xs text-gray-500">Last 7 days vs previous 7 days</span>
              </div>
            </div>
          )}
          
          {index === 3 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center">
                <Clock className="h-3 w-3 text-gray-400 mr-1" />
                <span className="text-xs text-gray-500">Dashboard last updated: just now</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsCards;