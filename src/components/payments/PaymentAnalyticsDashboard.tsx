import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CreditCard, Calendar, MapPin, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentsAPI } from '../../services/api';
import { paymentAnalyticsData } from '../../utils/dummyData';

interface PaymentAnalyticsProps {
  className?: string;
}

interface AnalyticsData {
  totalEarnings: number;
  earningsByMethod: {
    _id: string;
    total: number;
  }[];
  earningsByParkingSpot: {
    _id: {
      spotId: string;
      spotName: string;
      location: string;
    };
    total: number;
    count: number;
  }[];
  earningsByDay: {
    _id: string;
    total: number;
    count: number;
  }[];
  paymentMethodDistribution: {
    _id: string;
    count: number;
  }[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PaymentAnalyticsDashboard: React.FC<PaymentAnalyticsProps> = ({ className }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0] // today
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const response = await paymentsAPI.getPaymentAnalytics({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
      
      setAnalyticsData(response.data.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch analytics data');
      toast.error('Failed to load analytics data');
      
      // Set sample data for development/preview
      setAnalyticsData(getSampleData());
    } finally {
      setLoading(false);
    }
  };

  const getSampleData = (): AnalyticsData => {
    return paymentAnalyticsData;
  };

  const formatCurrency = (amount: number) => {
    return `NPR ${amount.toLocaleString()}`;
  };

  const formatMethodName = (method: string) => {
    switch (method) {
      case 'khalti':
        return 'Khalti';
      case 'credit_card':
        return 'Credit Card';
      case 'debit_card':
        return 'Debit Card';
      case 'paypal':
        return 'PayPal';
      case 'cash':
        return 'Cash';
      default:
        return method.charAt(0).toUpperCase() + method.slice(1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-64 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-700">Loading analytics...</p>
      </div>
    );
  }

  if (error && !analyticsData) {
    return (
      <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg ${className}`} role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Analytics Dashboard</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              id="startDate"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              id="endDate"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
          </div>
          <div className="flex-1 flex items-end">
            <button
              onClick={fetchAnalyticsData}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-purple-900">Total Earnings</h3>
              <p className="text-2xl font-bold text-purple-700">{formatCurrency(analyticsData.totalEarnings)}</p>
            </div>
          </div>
        </div>
        
        {analyticsData.earningsByMethod.slice(0, 3).map((method, index) => (
          <div key={method._id} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-blue-900">{formatMethodName(method._id)}</h3>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(method.total)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Earnings by Payment Method */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Earnings by Payment Method</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={analyticsData.earningsByMethod}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" tickFormatter={formatMethodName} />
              <YAxis tickFormatter={(value) => `NPR ${value}`} />
              <Tooltip 
                formatter={(value: number) => [`NPR ${value.toLocaleString()}`, 'Amount']}
                labelFormatter={formatMethodName}
              />
              <Legend />
              <Bar dataKey="total" name="Amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Method Distribution */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.paymentMethodDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="_id"
                label={({ _id, percent }) => `${formatMethodName(_id)}: ${(percent * 100).toFixed(0)}%`}
              >
                {analyticsData.paymentMethodDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value} transactions`, 'Count']} />
              <Legend formatter={formatMethodName} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Earnings by Day */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Earnings</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={analyticsData.earningsByDay}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" tickFormatter={formatDate} />
            <YAxis tickFormatter={(value) => `NPR ${value}`} />
            <Tooltip 
              formatter={(value: number) => [`NPR ${value.toLocaleString()}`, 'Amount']}
              labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
            />
            <Legend />
            <Bar dataKey="total" name="Amount" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Earnings by Parking Spot */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Earning Parking Spots</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spot Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Earnings
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. per Booking
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.earningsByParkingSpot.map((spot) => (
                <tr key={spot._id.spotId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{spot._id.spotName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{spot._id.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{spot.count}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(spot.total)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(spot.total / spot.count)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentAnalyticsDashboard;