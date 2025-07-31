import React from 'react';
import { Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SessionActivity {
  date: string;
  count: number;
}

interface DailyActivityOverviewProps {
  sessionActivity?: SessionActivity[];
}

const DailyActivityOverview: React.FC<DailyActivityOverviewProps> = ({ sessionActivity = [] }) => {
  // Use provided data or fallback to sample data
  const chartData = sessionActivity && sessionActivity.length > 0 
    ? sessionActivity 
    : [
        { date: '2024-07-14', count: 5 },
        { date: '2024-07-15', count: 8 },
        { date: '2024-07-16', count: 12 },
        { date: '2024-07-17', count: 7 },
        { date: '2024-07-18', count: 10 },
        { date: '2024-07-19', count: 15 },
        { date: '2024-07-20', count: 9 }
      ];

  // Format date for display
  const formattedData = chartData.map(item => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })
  }));

  // Calculate total sessions
  const totalSessions = chartData.reduce((sum, item) => sum + item.count, 0);
  
  // Calculate average sessions per day
  const avgSessions = chartData.length > 0 ? Math.round(totalSessions / chartData.length) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Activity className="h-5 w-5 text-purple-600 mr-2" />
          <h2 className="text-lg font-bold text-gray-900">Daily Activity</h2>
        </div>
      </div>
      
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="displayDate" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 10 }}
            />
            <YAxis 
              hide={true}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
            <Tooltip 
              formatter={(value) => [value, 'Sessions']}
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                fontSize: '12px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#8B5CF6" 
              fillOpacity={1} 
              fill="url(#colorSessions)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="text-xs text-purple-600 font-medium">Total Sessions</div>
          <div className="text-xl font-bold text-purple-900 mt-1">{totalSessions}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="text-xs text-purple-600 font-medium">Avg. Per Day</div>
          <div className="text-xl font-bold text-purple-900 mt-1">{avgSessions}</div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <div className="flex justify-between items-center">
          <span>Most Active Day</span>
          <span className="font-medium text-gray-700">
            {formattedData.reduce((max, item) => item.count > max.count ? item : max, { count: 0, displayDate: '' }).displayDate}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DailyActivityOverview;