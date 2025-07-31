/**
 * Earnings Page Component
 * View and analyze parking spot earnings
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Download,
  BarChart2,
  PieChart,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { RootState, AppDispatch } from '../store/store';
import { fetchBookings } from '../store/slices/bookingsSlice';
import { fetchSpots } from '../store/slices/spotsSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RPieChart,
  Pie,
  Cell
} from 'recharts';

const EarningsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, loading: bookingsLoading } = useSelector((state: RootState) => state.bookings);
  const { spots, loading: spotsLoading } = useSelector((state: RootState) => state.spots);
  
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Mock data for earnings
  const mockEarningsData = {
    daily: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: Math.random() * 100 + 50
    })),
    spots: [
      { id: '1', name: 'Downtown A1', location: 'Main Street', earnings: 1250.75 },
      { id: '2', name: 'Airport Terminal B', location: 'Airport Road', earnings: 980.50 },
      { id: '3', name: 'Shopping Mall P3', location: 'Commerce Avenue', earnings: 875.25 },
      { id: '4', name: 'City Center C5', location: 'Central Plaza', earnings: 750.00 },
      { id: '5', name: 'Beach Front B2', location: 'Ocean Drive', earnings: 625.50 }
    ],
    bookingTypes: [
      { name: 'standard', value: 65 },
      { name: 'compact', value: 25 },
      { name: 'handicap', value: 5 },
      { name: 'electric', value: 15 }
    ],
    transactions: Array.from({ length: 20 }, (_, i) => ({
      id: `tr-${i+1}`,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      amount: Math.random() * 50 + 10,
      spotName: ['Downtown A1', 'Airport Terminal B', 'Shopping Mall P3', 'City Center C5', 'Beach Front B2'][Math.floor(Math.random() * 5)],
      location: ['Main Street', 'Airport Road', 'Commerce Avenue', 'Central Plaza', 'Ocean Drive'][Math.floor(Math.random() * 5)],
      duration: Math.random() * 5 + 1
    }))
  };

  useEffect(() => {
    dispatch(fetchBookings({ limit: 100 }));
    dispatch(fetchSpots({ limit: 100 }));
  }, [dispatch]);

  // Calculate earnings data
  const calculateEarnings = () => {
    if (!Array.isArray(bookings)) return { total: 0, today: 0, thisWeek: 0, thisMonth: 0 };
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const paidBookings = bookings.filter(booking => booking?.paymentStatus === 'paid');
    
    const total = paidBookings.reduce((sum, booking) => sum + (booking?.totalCost || 0), 0);
    
    const todayEarnings = paidBookings
      .filter(booking => booking?.createdAt && new Date(booking.createdAt) >= today)
      .reduce((sum, booking) => sum + (booking?.totalCost || 0), 0);
      
    const weekEarnings = paidBookings
      .filter(booking => booking?.createdAt && new Date(booking.createdAt) >= weekStart)
      .reduce((sum, booking) => sum + (booking?.totalCost || 0), 0);
      
    const monthEarnings = paidBookings
      .filter(booking => booking?.createdAt && new Date(booking.createdAt) >= monthStart)
      .reduce((sum, booking) => sum + (booking?.totalCost || 0), 0);
      
    return {
      total,
      today: todayEarnings,
      thisWeek: weekEarnings,
      thisMonth: monthEarnings
    };
  };

  const earnings = calculateEarnings();

  // Generate chart data
  const generateDailyEarningsData = () => {
    if (!Array.isArray(bookings)) return [];
    
    const now = new Date();
    const daysToShow = dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 365;
    
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - daysToShow);
    
    const dateMap = new Map();
    
    // Initialize all dates with zero earnings
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, 0);
    }
    
    // Add earnings for each date
    if (Array.isArray(bookings)) {
      bookings
        .filter(booking => booking?.paymentStatus === 'paid' && booking?.createdAt && new Date(booking.createdAt) >= startDate)
        .forEach(booking => {
          if (booking?.createdAt) {
            const dateStr = new Date(booking.createdAt).toISOString().split('T')[0];
            if (dateMap.has(dateStr)) {
              dateMap.set(dateStr, dateMap.get(dateStr) + (booking?.totalCost || 0));
            }
          }
        });
    }
    
    // Convert map to array of objects
    const result = Array.from(dateMap.entries()).map(([date, amount]) => ({
      date,
      amount
    }));
    
    // Sort by date
    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const generateSpotEarningsData = () => {
    if (!Array.isArray(bookings) || !Array.isArray(spots)) return [];
    
    const spotEarnings = new Map();
    
    // Initialize all spots with zero earnings
    spots.forEach(spot => {
      if (spot && spot._id) {
        spotEarnings.set(spot._id, {
          id: spot._id,
          name: spot.spotNumber || 'Unknown',
          location: spot.location || 'Unknown',
          earnings: 0
        });
      }
    });
    
    // Add earnings for each spot
    bookings
      .filter(booking => booking?.paymentStatus === 'paid')
      .forEach(booking => {
        if (!booking) return;
        const spotId = typeof booking.parkingSpot === 'object' ? booking.parkingSpot?._id : booking.parkingSpot;
        if (spotId && spotEarnings.has(spotId)) {
          const spot = spotEarnings.get(spotId);
          spot.earnings += booking.totalCost || 0;
          spotEarnings.set(spotId, spot);
        }
      });
    
    // Convert map to array and sort by earnings
    return Array.from(spotEarnings.values())
      .filter(spot => spot.earnings > 0)
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 5);
  };

  const generateBookingTypeData = () => {
    if (!Array.isArray(bookings)) return [];
    
    const typeCount = new Map();
    
    // Count bookings by spot type
    bookings
      .filter(booking => booking?.paymentStatus === 'paid')
      .forEach(booking => {
        if (!booking) return;
        const spotType = typeof booking.parkingSpot === 'object' ? booking.parkingSpot?.type : 'unknown';
        typeCount.set(spotType, (typeCount.get(spotType) || 0) + 1);
      });
    
    // Convert map to array
    return Array.from(typeCount.entries()).map(([name, value]) => ({
      name,
      value
    }));
  };

  // Use mock data if real data is empty
  const dailyEarningsData = generateDailyEarningsData().length > 0 
    ? generateDailyEarningsData() 
    : mockEarningsData.daily;
    
  const spotEarningsData = generateSpotEarningsData().length > 0 
    ? generateSpotEarningsData() 
    : mockEarningsData.spots;
    
  const bookingTypeData = generateBookingTypeData().length > 0 
    ? generateBookingTypeData() 
    : mockEarningsData.bookingTypes;

  // Transaction history
  const getTransactions = () => {
    if (!Array.isArray(bookings) || bookings.length === 0) {
      // Return mock transactions if no real data is available
      return mockEarningsData.transactions;
    }
    
    return bookings
      .filter(booking => booking?.paymentStatus === 'paid')
      .map(booking => ({
        id: booking?._id || 'unknown',
        date: booking?.createdAt ? new Date(booking.createdAt) : new Date(),
        amount: booking?.totalCost || 0,
        spotName: typeof booking?.parkingSpot === 'object' ? booking.parkingSpot?.spotNumber || 'Unknown' : 'Unknown Spot',
        location: typeof booking?.parkingSpot === 'object' ? booking.parkingSpot?.location || 'Unknown' : 'Unknown Location',
        duration: booking?.duration || 0
      }))
      .sort((a, b) => {
        if (sortBy === 'date') {
          return sortOrder === 'asc' 
            ? a.date.getTime() - b.date.getTime() 
            : b.date.getTime() - a.date.getTime();
        } else {
          return sortOrder === 'asc' 
            ? a.amount - b.amount 
            : b.amount - a.amount;
        }
      });
  };

  const transactions = getTransactions();

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const loading = bookingsLoading || spotsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-600 mt-1">
            Track and analyze your parking spot revenue
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn-outline flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Earnings</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(earnings.total)}</p>
          <p className="text-sm text-gray-600 mt-2">Lifetime earnings</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Today</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(earnings.today)}</p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="text-green-600 font-medium">+{((earnings.today / (earnings.total || 1)) * 100).toFixed(1)}%</span> of total
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">This Week</h3>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(earnings.thisWeek)}</p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="text-purple-600 font-medium">+{((earnings.thisWeek / (earnings.total || 1)) * 100).toFixed(1)}%</span> of total
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">This Month</h3>
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart2 className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(earnings.thisMonth)}</p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="text-orange-600 font-medium">+{((earnings.thisMonth / (earnings.total || 1)) * 100).toFixed(1)}%</span> of total
          </p>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Earnings Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Daily Earnings</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setDateRange('week')}
                  className={`px-3 py-1 text-sm rounded-lg ${dateRange === 'week' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Week
                </button>
                <button
                  onClick={() => setDateRange('month')}
                  className={`px-3 py-1 text-sm rounded-lg ${dateRange === 'month' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Month
                </button>
                <button
                  onClick={() => setDateRange('year')}
                  className={`px-3 py-1 text-sm rounded-lg ${dateRange === 'year' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Year
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="medium" text="Loading chart data..." />
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyEarningsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => {
                        const d = new Date(date);
                        return dateRange === 'week' 
                          ? d.toLocaleDateString(undefined, { weekday: 'short' })
                          : dateRange === 'month'
                            ? d.getDate().toString()
                            : d.toLocaleDateString(undefined, { month: 'short' });
                      }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Earnings']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Legend />
                    <Bar dataKey="amount" name="Earnings" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Earning Spots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Top Earning Spots</h2>
              <div className="flex items-center space-x-2">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <PieChart className="w-5 h-5" />
                </button>
                <button className="p-1 text-blue-600">
                  <BarChart2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="medium" text="Loading chart data..." />
              </div>
            ) : spotEarningsData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <BarChart2 className="w-12 h-12 mb-2 text-gray-300" />
                <p>No earnings data available</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={spotEarningsData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100}
                      tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Earnings']}
                      labelFormatter={(label) => label}
                    />
                    <Legend />
                    <Bar dataKey="earnings" name="Earnings" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Booking Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Booking Distribution by Spot Type</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="medium" text="Loading chart data..." />
            </div>
          ) : bookingTypeData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <PieChart className="w-12 h-12 mb-2 text-gray-300" />
              <p>No booking data available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RPieChart>
                    <Pie
                      data={bookingTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {bookingTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Bookings']} />
                    <Legend />
                  </RPieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
                <div className="space-y-4">
                  {bookingTypeData.map((type, index) => (
                    <div key={type.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-gray-700 capitalize">{type.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{type.value}</span>
                        <span className="text-gray-500 text-sm">
                          ({((type.value / bookingTypeData.reduce((sum, t) => sum + t.value, 0)) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Date Range</label>
                <select className="form-input">
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              <div>
                <label className="form-label">Payment Status</label>
                <select className="form-input">
                  <option value="all">All Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <div>
                <label className="form-label">Amount Range</label>
                <div className="flex items-center space-x-2">
                  <input type="number" placeholder="Min" className="form-input" />
                  <span>-</span>
                  <input type="number" placeholder="Max" className="form-input" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spot
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('date')}
                >
                  <div className="flex items-center">
                    Date
                    {sortBy === 'date' && (
                      sortOrder === 'asc' ? 
                        <ChevronUp className="w-4 h-4 ml-1" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('amount')}
                >
                  <div className="flex items-center">
                    Amount
                    {sortBy === 'amount' && (
                      sortOrder === 'asc' ? 
                        <ChevronUp className="w-4 h-4 ml-1" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center">
                    <LoadingSpinner size="small" text="Loading transactions..." />
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transaction.spotName}</div>
                      <div className="text-sm text-gray-500">{transaction.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transaction.date.toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.duration} hours</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{transactions.length}</span> transactions
          </p>
          <div className="flex items-center space-x-2">
            <button className="btn-outline">Previous</button>
            <button className="btn-outline">Next</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EarningsPage;