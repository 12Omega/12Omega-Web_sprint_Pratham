/**
 * Dashboard Page Component
 * Main dashboard with overview and quick actions
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus
} from 'lucide-react';
import { RootState, AppDispatch } from '../store/store';
import { fetchBookings } from '../store/slices/bookingsSlice';
import { fetchSpots } from '../store/slices/spotsSlice';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { bookings, loading: bookingsLoading } = useSelector((state: RootState) => state.bookings);
  const { spots, loading: spotsLoading } = useSelector((state: RootState) => state.spots);
  
  // Add mock user data if user is undefined
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'user'
  };
  
  const userData = user || mockUser;
  
  // Add mock data for recent activities
  const recentActivities = [
    { 
      id: 1, 
      type: 'booking', 
      action: 'created', 
      spotName: 'Downtown Parking A12',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
    },
    { 
      id: 2, 
      type: 'payment', 
      action: 'completed', 
      amount: 15.50,
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2 hours ago
    },
    { 
      id: 3, 
      type: 'booking', 
      action: 'completed', 
      spotName: 'Airport Terminal B',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
    },
    { 
      id: 4, 
      type: 'account', 
      action: 'updated', 
      detail: 'profile information',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
    }
  ];

  useEffect(() => {
    dispatch(fetchBookings({ limit: 5 }));
    dispatch(fetchSpots({ limit: 8, status: 'available' }));
  }, [dispatch]);

  // Handle case where bookings might be undefined or not an array
  const bookingsArray = Array.isArray(bookings) ? bookings : [];
  
  const activeBookings = bookingsArray.filter(booking => booking?.status === 'active');
  const upcomingBookings = bookingsArray.filter(booking => {
    if (!booking?.startTime) return false;
    const startTime = new Date(booking.startTime);
    const now = new Date();
    return startTime > now && booking.status === 'active';
  });

  const stats = [
    {
      title: 'Active Bookings',
      value: activeBookings.length,
      icon: Calendar,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Available Spots',
      value: Array.isArray(spots) ? spots.filter(spot => spot?.status === 'available').length : 0,
      icon: MapPin,
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      title: 'Total Bookings',
      value: bookingsArray.length,
      icon: Car,
      color: 'bg-purple-500',
      change: '+18%'
    },
    {
      title: 'Hours Parked',
      value: bookingsArray.reduce((total, booking) => total + (booking?.duration || 0), 0).toFixed(1),
      icon: Clock,
      color: 'bg-orange-500',
      change: '+8%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {userData.name}! 👋
        </h1>
        <p className="text-blue-100">
          Here's what's happening with your parking today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
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
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
              <Link
                to="/app/bookings"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {bookingsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : !bookingsArray || bookingsArray.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No bookings yet</p>
                <Link
                  to="/app/spots"
                  className="btn-primary mt-4 inline-flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Book a Spot
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookingsArray.slice(0, 3).map((booking) => (
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
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {typeof booking.parkingSpot === 'object' 
                          ? booking.parkingSpot.location 
                          : 'Parking Spot'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.startTime).toLocaleDateString()} • 
                        ${booking.totalCost.toFixed(2)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      booking.status === 'active' ? 'bg-green-100 text-green-800' :
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Available Spots */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Available Spots</h2>
              <Link
                to="/app/spots"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {spotsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : !Array.isArray(spots) || spots.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No available spots</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.isArray(spots) && spots.slice(0, 4).map((spot) => (
                  <div key={spot._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{spot.spotNumber}</h3>
                      <span className="text-sm font-medium text-green-600">
                        ${spot.hourlyRate}/hr
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{spot.location}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        spot.type === 'standard' ? 'bg-blue-100 text-blue-800' :
                        spot.type === 'compact' ? 'bg-yellow-100 text-yellow-800' :
                        spot.type === 'handicap' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {spot.type}
                      </span>
                      <Link
                        to={`/app/spots/${spot._id}`}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const timestamp = new Date(activity.timestamp);
              const timeAgo = () => {
                const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);
                if (seconds < 60) return `${seconds} seconds ago`;
                const minutes = Math.floor(seconds / 60);
                if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
                const hours = Math.floor(minutes / 60);
                if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
                const days = Math.floor(hours / 24);
                return `${days} ${days === 1 ? 'day' : 'days'} ago`;
              };
              
              return (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg mt-1 ${
                    activity.type === 'booking' ? 'bg-blue-100' :
                    activity.type === 'payment' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    {activity.type === 'booking' ? (
                      <Calendar className={`w-4 h-4 ${
                        activity.action === 'created' ? 'text-blue-600' : 'text-green-600'
                      }`} />
                    ) : activity.type === 'payment' ? (
                      <Clock className="w-4 h-4 text-green-600" />
                    ) : (
                      <User className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">
                        {activity.type === 'booking' && (
                          <>
                            {activity.action === 'created' ? 'New booking' : 'Completed booking'} for {activity.spotName}
                          </>
                        )}
                        {activity.type === 'payment' && (
                          <>
                            Payment of ${activity.amount?.toFixed(2)} {activity.action}
                          </>
                        )}
                        {activity.type === 'account' && (
                          <>
                            {activity.action} {activity.detail}
                          </>
                        )}
                      </p>
                      <span className="text-xs text-gray-500">{timeAgo()}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {activity.type === 'booking' && (
                        <>
                          {activity.action === 'created' ? 'Successfully booked a parking spot' : 'Parking session ended'}
                        </>
                      )}
                      {activity.type === 'payment' && (
                        <>
                          Transaction {activity.action} successfully
                        </>
                      )}
                      {activity.type === 'account' && (
                        <>
                          Your account information was updated
                        </>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
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
          <Link
            to="/app/spots"
            className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <MapPin className="w-6 h-6 text-blue-600" />
            <span className="font-medium text-blue-900">Find Parking</span>
          </Link>
          <Link
            to="/app/bookings"
            className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Calendar className="w-6 h-6 text-green-600" />
            <span className="font-medium text-green-900">My Bookings</span>
          </Link>
          <Link
            to="/app/profile"
            className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Car className="w-6 h-6 text-purple-600" />
            <span className="font-medium text-purple-900">Profile</span>
          </Link>
          {user?.role === 'admin' && (
            <Link
              to="/app/admin"
              className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <span className="font-medium text-orange-900">Admin Panel</span>
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;