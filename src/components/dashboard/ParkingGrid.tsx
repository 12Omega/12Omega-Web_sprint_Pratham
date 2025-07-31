import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ParkingGridProps {
  parkingSpots?: {
    available: number;
    occupied: number;
    maintenance: number;
    total: number;
  };
}

const ParkingGrid: React.FC<ParkingGridProps> = ({ parkingSpots }) => {
  // Use provided data or fallback to sample data
  const available = parkingSpots?.available ?? 12;
  const occupied = parkingSpots?.occupied ?? 8;
  const maintenance = parkingSpots?.maintenance ?? 4;
  const total = parkingSpots?.total ?? 24;
  
  const pieData = [
    { name: 'Available', value: available, color: '#10B981' },
    { name: 'Occupied', value: occupied, color: '#EF4444' },
    { name: 'Maintenance', value: maintenance, color: '#F59E0B' }
  ];
  
  const COLORS = ['#10B981', '#EF4444', '#F59E0B'];
  
  const slots = [
    { id: '01', status: 'available', type: 'Standard', price: '$5.00/hr' },
    { id: '02', status: 'occupied', type: 'Large', price: '$7.50/hr' },
    { id: '03', status: 'maintenance', type: 'Standard', price: '$5.00/hr' },
    { id: '04', status: 'available', type: 'Compact', price: '$4.00/hr' },
    { id: '05', status: 'occupied', type: 'Standard', price: '$5.00/hr' },
    { id: '06', status: 'available', type: 'Large', price: '$7.50/hr' },
    { id: '07', status: 'available', type: 'Standard', price: '$5.00/hr' },
    { id: '08', status: 'occupied', type: 'Compact', price: '$4.00/hr' }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-100 text-green-800 border-green-200',
      occupied: 'bg-red-100 text-red-800 border-red-200',
      maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      reserved: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[status as keyof typeof colors];
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Parking Status</h2>
      </div>
      
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [value, 'Spots']}
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {pieData.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: item.color }}></div>
              <span className="text-xs text-gray-600">{item.name}</span>
            </div>
            <div className="text-lg font-semibold">{item.value}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Occupancy Rate</div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${(occupied / total) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{Math.round((occupied / total) * 100)}% Occupied</span>
          <span className="text-xs text-gray-500">{total} Total Spots</span>
        </div>
      </div>
    </div>
  );
};

export default ParkingGrid;