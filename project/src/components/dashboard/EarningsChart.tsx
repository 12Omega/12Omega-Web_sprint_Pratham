import React from 'react';
import { BarChart3 } from 'lucide-react';

const EarningsChart: React.FC = () => {
  const data = [
    { day: 'Mon', earnings: 120 },
    { day: 'Tue', earnings: 190 },
    { day: 'Wed', earnings: 170 },
    { day: 'Thu', earnings: 200 },
    { day: 'Fri', earnings: 240 },
    { day: 'Sat', earnings: 280 },
    { day: 'Sun', earnings: 210 }
  ];

  const maxEarnings = Math.max(...data.map(d => d.earnings));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Weekly Earnings</h2>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors font-medium">
            Week
          </button>
          <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
            Month
          </button>
          <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
            Year
          </button>
        </div>
      </div>
      
      <div className="h-64 flex items-end justify-between space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-gray-200 rounded-t-lg relative overflow-hidden">
              <div
                className="bg-gradient-to-t from-blue-600 to-indigo-600 rounded-t-lg transition-all duration-500 hover:from-blue-700 hover:to-indigo-700"
                style={{ height: `${(item.earnings / maxEarnings) * 200}px` }}
              ></div>
            </div>
            <div className="mt-2 text-sm font-medium text-gray-600">{item.day}</div>
            <div className="text-xs text-gray-500">${item.earnings}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EarningsChart;