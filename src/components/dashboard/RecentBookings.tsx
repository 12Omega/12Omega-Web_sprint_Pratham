import React from 'react';
import { Car } from 'lucide-react';

const RecentBookings: React.FC = () => {
  const bookings = [
    {
      id: 1,
      slot: '#12',
      license: 'ABC 1234',
      duration: '2 hours',
      time: 'Today, 09:30 AM - 11:30 AM',
      amount: '$12.00',
      status: 'completed'
    },
    {
      id: 2,
      slot: '#05',
      license: 'XYZ 5678',
      duration: '4 hours',
      time: 'Today, 01:15 PM - 05:15 PM',
      amount: '$24.00',
      status: 'active'
    },
    {
      id: 3,
      slot: '#18',
      license: 'DEF 9012',
      duration: '1 hour',
      time: 'Tomorrow, 10:00 AM - 11:00 AM',
      amount: '$8.00',
      status: 'upcoming'
    },
    {
      id: 4,
      slot: '#03',
      license: 'GHI 3456',
      duration: '3 hours',
      time: 'Yesterday, 02:30 PM - 05:30 PM',
      amount: '$18.00',
      status: 'cancelled'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      active: 'bg-blue-100 text-blue-800',
      upcoming: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors];
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="flex items-start p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100">
            <div className="p-2 bg-blue-100 rounded-xl mr-4">
              <Car className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">Slot {booking.slot}</p>
              <p className="text-sm text-gray-600">{booking.license} • {booking.duration}</p>
              <p className="text-sm text-gray-500 mt-1">{booking.time}</p>
            </div>
            <div className="ml-4 text-right">
              <p className="font-semibold text-gray-900">{booking.amount}</p>
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentBookings;