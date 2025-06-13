import React from 'react';

const ParkingGrid: React.FC = () => {
  const slots = [
    { id: '01', status: 'available', type: 'Standard', price: '$5.00/hr' },
    { id: '02', status: 'booked', type: 'Large', price: '$7.50/hr' },
    { id: '03', status: 'maintenance', type: 'Standard', price: '$5.00/hr' },
    { id: '04', status: 'available', type: 'Compact', price: '$4.00/hr' },
    { id: '05', status: 'reserved', type: 'Standard', price: '$5.00/hr' },
    { id: '06', status: 'available', type: 'Large', price: '$7.50/hr' },
    { id: '07', status: 'available', type: 'Standard', price: '$5.00/hr' },
    { id: '08', status: 'booked', type: 'Compact', price: '$4.00/hr' }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-100 text-green-800 border-green-200',
      booked: 'bg-red-100 text-red-800 border-red-200',
      maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      reserved: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[status as keyof typeof colors];
  };

  const getLegendColor = (status: string) => {
    const colors = {
      available: 'bg-green-500',
      booked: 'bg-red-500',
      maintenance: 'bg-yellow-500',
      reserved: 'bg-blue-500'
    };
    return colors[status as keyof typeof colors];
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Parking Slots Visualization</h2>
        <div className="flex items-center space-x-6">
          {['available', 'booked', 'maintenance', 'reserved'].map((status) => (
            <div key={status} className="flex items-center">
              <span className={`w-4 h-4 rounded ${getLegendColor(status)} mr-2`}></span>
              <span className="text-sm text-gray-600 capitalize">{status}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${getStatusColor(slot.status)}`}
          >
            <div className="text-center">
              <div className="text-lg font-bold">#{slot.id}</div>
              <div className="text-xs mt-1">{slot.type}</div>
              <div className="text-xs mt-1 font-medium">{slot.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingGrid;