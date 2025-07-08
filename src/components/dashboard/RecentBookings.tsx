import React from 'react';
import { Activity, CalendarDays } from 'lucide-react'; // Changed icon
import { SessionActivityData } from '../../services/api'; // Corrected path

interface DailyActivityProps {
  sessionActivity?: SessionActivityData[];
}

const DailyActivityOverview: React.FC<DailyActivityProps> = ({ sessionActivity = [] }) => {
  if (!sessionActivity || sessionActivity.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 text-center text-gray-500">
        No activity data available.
      </div>
    );
  }

  // Show last 5 days for example
  const displayData = sessionActivity
    .map(item => ({
      ...item,
      formattedDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' }),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by most recent
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100 h-full"> {/* Added h-full for consistent height */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Daily Active Sessions</h2>
        {/* <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
          View All
        </button> */}
      </div>
      
      {displayData.length > 0 ? (
        <div className="space-y-4">
          {displayData.map((item, index) => (
            <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100">
              <div className="p-2 bg-indigo-100 rounded-xl mr-4">
                <CalendarDays className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800">{item.formattedDate}</p>
              </div>
              <div className="ml-4 text-right">
                <p className="font-semibold text-gray-900 flex items-center">
                  {item.activeSessions} 
                  <Activity className="h-4 w-4 text-green-500 ml-1.5" />
                </p>
                <p className="text-xs text-gray-500">Active Sessions</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
         <p className="text-center text-gray-500 py-10">Not enough data to display activity.</p>
      )}
    </div>
  );
};

export default DailyActivityOverview;