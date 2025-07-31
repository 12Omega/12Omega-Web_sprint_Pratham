import React from 'react';
import { Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UserGrowthData {
  month: string;
  count: number;
}

interface UserGrowthChartProps {
  userGrowthData?: UserGrowthData[];
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ userGrowthData = [] }) => {
  // Use provided data or fallback to sample data
  const chartData = userGrowthData && userGrowthData.length > 0 
    ? userGrowthData 
    : [
        { month: '2024-01', count: 12 },
        { month: '2024-02', count: 19 },
        { month: '2024-03', count: 25 },
        { month: '2024-04', count: 32 },
        { month: '2024-05', count: 45 },
        { month: '2024-06', count: 51 },
        { month: '2024-07', count: 60 },
        { month: '2024-08', count: 65 },
        { month: '2024-09', count: 72 },
        { month: '2024-10', count: 78 },
        { month: '2024-11', count: 85 },
        { month: '2024-12', count: 92 }
      ];

  // Format month for display
  const formattedData = chartData.map(item => ({
    ...item,
    displayMonth: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' })
  }));

  // Calculate growth percentage
  const calculateGrowth = () => {
    if (chartData.length < 2) return 0;
    const firstValue = chartData[0].count;
    const lastValue = chartData[chartData.length - 1].count;
    if (firstValue === 0) return 100;
    return ((lastValue - firstValue) / firstValue) * 100;
  };

  const growthPercentage = calculateGrowth();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">User Growth</h2>
        </div>
        <div className="text-sm font-medium text-indigo-600">
          {growthPercentage > 0 ? '+' : ''}{growthPercentage.toFixed(1)}% growth
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="displayMonth" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value) => [value, 'Users']}
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#4F46E5" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Total Users: <span className="font-semibold text-gray-900">
            {chartData[chartData.length - 1]?.count || 0}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          New This Month: <span className="font-semibold text-gray-900">
            {chartData.length >= 2 
              ? chartData[chartData.length - 1].count - chartData[chartData.length - 2].count 
              : chartData[0]?.count || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserGrowthChart;