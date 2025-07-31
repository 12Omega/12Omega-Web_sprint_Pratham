import React from 'react';
import { Calendar, Clock, MapPin, Car } from 'lucide-react';

interface BookingData {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  parkingSpot: {
    name: string;
    location: string;
    rate: number;
  };
  startTime: string;
  endTime: string;
  status: string;
  vehicleInfo: {
    licensePlate: string;
    make?: string;
    model?: string;
    color?: string;
  };
  totalCost: number;
  createdAt: string;
}

interface RecentBookingsProps {
  bookings?: BookingData[];
}

const RecentBookings: React.FC<RecentBookingsProps> = ({ bookings = [] }) => {
  // Use provided data or fallback to empty array
  const bookingsData = bookings && bookings.length > 0 ? bookings : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
          <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
        </div>
        {bookingsData.length > 0 && (
          <span className="text-xs font-medium text-gray-500">
            Showing {bookingsData.length} of {bookingsData.length}
          </span>
        )}
      </div>

      {bookingsData.length > 0 ? (
        <div className="space-y-4">
          {bookingsData.map((booking) => (
            <div
              key={booking._id}
              className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {booking.parkingSpot.name}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {booking.parkingSpot.location}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Start: {formatDate(booking.startTime)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>End: {formatDate(booking.endTime)}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center text-xs text-gray-600">
                <Car className="h-3 w-3 mr-1" />
                <span>
                  {booking.vehicleInfo.licensePlate}
                  {booking.vehicleInfo.make && ` • ${booking.vehicleInfo.make}`}
                  {booking.vehicleInfo.model && ` ${booking.vehicleInfo.model}`}
                  {booking.vehicleInfo.color && ` • ${booking.vehicleInfo.color}`}
                </span>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Booked by: {booking.user.name}
                </span>
                <span className="text-sm font-medium text-indigo-600">
                  ${booking.totalCost?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p>No recent bookings found</p>
          <p className="text-sm mt-1">Bookings will appear here once created</p>
        </div>
      )}
    </div>
  );
};

export default RecentBookings;