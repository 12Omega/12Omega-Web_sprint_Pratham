import React from 'react';
import { Users } from 'lucide-react'; // Changed icon
import { UserGrowthData } from '../../services/api'; // Corrected path

interface UserGrowthChartProps {
  userGrowthData?: UserGrowthData[];
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ userGrowthData = [] }) => {
  if (!userGrowthData || userGrowthData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 text-center text-gray-500">
        No user growth data available.
      </div>
    );
  }

  // Ensure data has 'count' and format 'date' for display
  const data = userGrowthData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // Format date
    count: item.count,
  })).slice(-7); // Show last 7 data points for example

  const maxCount = Math.max(...data.map(d => d.count), 0); // Ensure maxCount is at least 0

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-green-600 mr-2" /> {/* Changed icon and color */}
          <h2 className="text-xl font-bold text-gray-900">User Growth</h2>
        </div>
        {/* Optional: Add controls for time range if needed */}
      </div>
      
      {data.length > 0 ? (
        <div className="h-64 flex items-end justify-between space-x-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center group">
              <div 
                className="w-full bg-gray-200 rounded-t-lg relative overflow-hidden group-hover:opacity-80 transition-opacity"
                title={`Users: ${item.count}`}
              >
                <div
                  className="bg-gradient-to-t from-green-500 to-emerald-500 rounded-t-lg transition-all duration-500 ease-out"
                  style={{ height: `${maxCount > 0 ? (item.count / maxCount) * 100 : 0}%` }} // Use percentage for bar height
                ></div>
              </div>
              <div className="mt-2 text-xs font-medium text-gray-600 whitespace-nowrap">{item.date}</div>
              {/* <div className="text-xs text-gray-500">{item.count}</div> */}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">Not enough data to display chart.</p>
      )}
    </div>
  );
};

export default UserGrowthChart;