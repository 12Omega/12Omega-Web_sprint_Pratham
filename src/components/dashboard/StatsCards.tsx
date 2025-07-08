import React from 'react';
import { Users, Wifi, Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react'; // Adjusted icons

interface StatsCardsProps {
  totalUsers?: number;
  activeSessionsToday?: number;
  recentUsersChange?: string; // This is a string like "+2.50" or "-1.00"
  // Add more props as needed for other stats if the API provides them
}

const StatsCards: React.FC<StatsCardsProps> = ({
  totalUsers = 0,
  activeSessionsToday = 0,
  recentUsersChange = "0.00",
}) => {

  const parseChange = (changeStr: string) => {
    const value = parseFloat(changeStr);
    if (value > 0) return { type: 'positive', value: `+${changeStr}` };
    if (value < 0) return { type: 'negative', value: changeStr };
    return { type: 'neutral', value: changeStr };
  };

  const recentUsersStat = parseChange(recentUsersChange);

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      // change: '+2 from last month', // Example, if you have this data
      // changeType: 'positive',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Sessions',
      value: activeSessionsToday.toLocaleString(),
      // subtitle: 'Currently Active',
      icon: Wifi,
      color: 'green'
    },
    {
      title: 'User Change (Recent)',
      value: recentUsersStat.value, // Shows the string like "+2.50"
      // subtitle: 'Compared to previous period',
      changeType: recentUsersStat.type,
      icon: recentUsersStat.type === 'positive' ? TrendingUp : recentUsersStat.type === 'negative' ? TrendingDown : Activity,
      color: recentUsersStat.type === 'positive' ? 'green' : recentUsersStat.type === 'negative' ? 'red' : 'yellow'
    },
    // Placeholder for a fourth card or can be removed
    {
      title: "Today's Metric", // Example, replace with actual data
      value: 'N/A',
      // change: '+0% from yesterday',
      // changeType: 'neutral',
      icon: Minus, // Placeholder icon
      color: 'gray'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600',
      yellow: 'bg-yellow-100 text-yellow-600'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${getColorClasses(stat.color)}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            {stat.change && (
              <span className={`text-sm font-medium flex items-center ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="h-4 w-4 mr-1" />
                {stat.change}
              </span>
            )}
            {stat.subtitle && (
              <div className="flex items-center mt-2">
                <div className="flex space-x-2">
                  <span className="w-3 h-3 bg-green-500 rounded-sm"></span>
                  <span className="w-3 h-3 bg-blue-500 rounded-sm"></span>
                </div>
                <span className="text-sm text-gray-500 ml-2">{stat.subtitle}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;