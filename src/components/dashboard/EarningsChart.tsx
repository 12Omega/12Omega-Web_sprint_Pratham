import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EarningsData {
  month: string;
  earnings: number;
}

interface EarningsChartProps {
  earningsData?: EarningsData[];
}

const EarningsChart: React.FC<EarningsChartProps> = ({ earningsData = [] }) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  
  // Use provided data or fallback to sample data if not available
  const chartData = earningsData && earningsData.length > 0 
    ? earningsData 
    : [
        { month: 'Jan', earnings: 1200 },
        { month: 'Feb', earnings: 1900 },
        { month: 'Mar', earnings: 1700 },
        { month: 'Apr', earnings: 2000 },
        { month: 'May', earnings: 2400 },
        { month: 'Jun', earnings: 2800 }
      ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Earnings Overview</h2>
        </div>
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 text-sm rounded-xl hover:bg-blue-200 transition-colors font-medium ${
              timeframe === 'week' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setTimeframe('week')}
          >
            Week
          </button>
          <button 
            className={`px-4 py-2 text-sm rounded-xl hover:bg-blue-200 transition-colors font-medium ${
              timeframe === 'month' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setTimeframe('month')}
          >
            Month
          </button>
          <button 
            className={`px-4 py-2 text-sm rounded-xl hover:bg-blue-200 transition-colors font-medium ${
              timeframe === 'year' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setTimeframe('year')}
          >
            Year
          </button>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              formatter={(value) => [`$${value}`, 'Earnings']}
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <Bar 
              dataKey="earnings" 
              fill="#4F46E5" 
              radius={[4, 4, 0, 0]}
              barSize={40}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Total Earnings: <span className="font-semibold text-gray-900">
            ${chartData.reduce((sum, item) => sum + item.earnings, 0).toLocaleString()}
          </span>
        </div>
        <div className="text-sm text-green-600 font-medium">
          +12.5% from previous period
        </div>
      </div>
    </div>
  );
};

export default EarningsChart;