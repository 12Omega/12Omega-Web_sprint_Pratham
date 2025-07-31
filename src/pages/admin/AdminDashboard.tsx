/**
 * Admin Dashboard Page Component
 * Overview and analytics for administrators
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Users, 
  MapPin, 
  Calendar, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { RootState, AppDispatch } from '../../store/store';
import { fetchSpots } from '../../store/slices/spotsSlice';
import { fetchBookings } from '../../store/slices/bookingsSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { spots, loading: spotsLoading } = useSelector((state: RootState) => state.spots);
  const { bookings, loading: bookingsLoading } = useSelector((state: RootState) => state.bookings);

  useEffect(() => {
    dispatch(fetchSpots({ limit: 100 }));
    dispatch(fetchBookings({ limit: 100 }));
  }, [dispatch]);

  // Calculate statistics
  const totalSpots = spots.length;
  const availableSpots = spots.filter(spot => spot.status === 'available').length;
  const occupiedSpots = spots.filter(spot => spot.status === 'occupied').length;
  const reservedSpots = spots.filter(spot => spot.status === 'reserved').length;

  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(booking => booking.status === 'active').length;
  const completedBookings = bookings.filter(booking => booking.status === 'completed').length;
  const cancelledBookings = bookings.filter(booking => booking.status === 'cancelled').length;

  const totalRevenue = bookings
    .filter(booking => booking.paymentStatus === 'paid')
    .reduce((sum, booking) => sum + booking.totalCost, 0);

  const todayBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.createdAt).toDateString();
    const today = new Date().toDateString();
    return bookingDate === today;
  }).length;

  const stats = [
    {
      title: 'Total Spots',
      value: totalSpots,
      icon: MapPin,
      color: 'bg-blue-500',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Active Bookings',
      value: activeBookings,
      icon: Calendar,
      color: 'bg-green-500',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+18%',
      trend: 'up'
    },
    {
      title: 'Today\'s Bookings',
      value: todayBookings,
      icon: Activity,
      color: 'bg-orange-500',
      change: '-3%',
      trend: 'down'
    }
  ];

  const spotStats = [
    { label: 'Available', value: availableSpots, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Occupied', value: occupiedSpots, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Reserved', value: reservedSpots, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Maintenance', value: spots.filter(s => s.status === 'maintenance').length, color: 'text-gray-600', bg: 'bg-gray-100' }
  ];

  const bookingStats = [
    { label: 'Active', value: activeBookings, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Completed', value: completedBookings, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Cancelled', value: cancelledBookings, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Expired', value: bookings.filter(b => b.status === 'expired').length, color: 'text-gray-600', bg: 'bg-gray-100' }
  ];

  if (spotsLoading || bookingsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="large" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">
          Admin Dashboard 👨‍💼
        </h1>
        <p className="text-purple-100">
          Monitor and manage your parking system
        </p>
      </motion.div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendIcon className={`w-4 h-4 mr-1 ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`} />
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parking Spots Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Parking Spots Status</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {spotStats.map((stat, index) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${stat.bg}`}></div>
                    <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
                    <span className="text-sm text-gray-500">
                      ({totalSpots > 0 ? ((stat.value / totalSpots) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">Occupancy Rate</span>
                <span className="font-bold text-gray-900">
                  {totalSpots > 0 ? (((occupiedSpots + reservedSpots) / totalSpots) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bookings Overview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Bookings Status</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {bookingStats.map((stat, index) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${stat.bg}`}></div>
                    <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
                    <span className="text-sm text-gray-500">
                      ({totalBookings > 0 ? ((stat.value / totalBookings) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">Success Rate</span>
                <span className="font-bold text-gray-900">
                  {totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
        </div>
        <div className="p-6">
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No bookings yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    booking.status === 'active' ? 'bg-green-100' :
                    booking.status === 'completed' ? 'bg-blue-100' :
                    booking.status === 'cancelled' ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    {booking.status === 'active' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : booking.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    ) : booking.status === 'cancelled' ? (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {typeof booking.parkingSpot === 'object' 
                            ? `${booking.parkingSpot.spotNumber} - ${booking.parkingSpot.location}`
                            : 'Parking Spot'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {typeof booking.user === 'object' 
                            ? booking.user.name 
                            : 'User'} • 
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${booking.totalCost.toFixed(2)}</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === 'active' ? 'bg-green-100 text-green-800' :
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => window.location.href = '/app/admin/spots'}
            className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <MapPin className="w-6 h-6 text-blue-600" />
            <span className="font-medium text-blue-900">Manage Spots</span>
          </button>
          <button
            onClick={() => window.location.href = '/app/admin/bookings'}
            className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Calendar className="w-6 h-6 text-green-600" />
            <span className="font-medium text-green-900">View Bookings</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <Users className="w-6 h-6 text-purple-600" />
            <span className="font-medium text-purple-900">User Management</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <Activity className="w-6 h-6 text-orange-600" />
            <span className="font-medium text-orange-900">Analytics</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;