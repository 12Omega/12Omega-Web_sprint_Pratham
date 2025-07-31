import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, ChevronDown, ChevronUp, Edit, Trash2, 
  CheckCircle, XCircle, Clock, MapPin, Car, CreditCard
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { bookingsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { recentBookingsData } from '../utils/dummyData';

interface Booking {
  _id: string;
  parkingSpot: {
    _id: string;
    spotNumber: string;
    location: string;
    address: string;
    hourlyRate: number;
  };
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'cancelled' | 'expired';
  totalCost: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  vehicleInfo: {
    licensePlate: string;
    make?: string;
    model?: string;
    color?: string;
  };
  createdAt: string;
}

const BookingsPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('startTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [currentPage, statusFilter, sortField, sortDirection]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 10,
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      try {
        // Try to fetch real data first
        const response = await bookingsAPI.getBookings(params);
        const bookingsData = response.data.data?.bookings || [];
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setTotalPages(response.data.data?.pagination?.totalPages || 1);
      } catch (apiError) {
        console.log('Using dummy booking data');
        // If API fails, use dummy data
        // Convert the recentBookingsData to match the Booking interface
        const dummyBookings: Booking[] = recentBookingsData.map(booking => ({
          _id: booking._id,
          parkingSpot: {
            _id: 'spot-' + Math.random().toString(36).substring(2, 9), // Generate a random ID
            spotNumber: booking.parkingSpot.spotNumber,
            location: booking.parkingSpot.location,
            rate: 7.50 // Default rate
          },
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: booking.status as 'active' | 'completed' | 'cancelled' | 'expired',
          totalCost: booking.totalCost,
          paymentStatus: booking.paymentStatus as 'pending' | 'paid' | 'failed' | 'refunded',
          vehicleInfo: {
            licensePlate: 'ABC-123', // Default license plate
            make: 'Toyota',
            model: 'Corolla',
            color: 'Silver'
          },
          createdAt: booking.createdAt
        }));
        
        setBookings(dummyBookings);
        setTotalPages(1);
      }
      
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingsAPI.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel booking');
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    try {
      await bookingsAPI.completeBooking(bookingId);
      toast.success('Booking completed successfully');
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete booking');
    }
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await bookingsAPI.deleteBooking(bookingId);
        toast.success('Booking deleted successfully');
        fetchBookings();
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete booking');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = Array.isArray(bookings) ? bookings.filter(booking => 
    (booking.parkingSpot?.spotNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (booking.parkingSpot?.location?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (booking.vehicleInfo?.licensePlate?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  ) : [];

  // Use our filtered bookings
  const displayBookings = bookings.length > 0 ? filteredBookings : [];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <DashboardHeader onLogout={logout} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
            <button
              onClick={() => navigate('/bookings/new')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              New Booking
            </button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by spot name or license plate..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Filter size={18} className="mr-2" />
                  Filters
                  {showFilters ? <ChevronUp size={18} className="ml-2" /> : <ChevronDown size={18} className="ml-2" />}
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={statusFilter}
                    onChange={(e) => handleStatusChange(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={sortField}
                    onChange={(e) => handleSort(e.target.value)}
                  >
                    <option value="startTime">Start Time</option>
                    <option value="endTime">End Time</option>
                    <option value="totalCost">Total Cost</option>
                    <option value="createdAt">Created Date</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Direction</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={sortDirection}
                    onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="ml-4 text-gray-700">Loading bookings...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Parking Spot
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vehicle
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {displayBookings.map((booking) => (
                        <tr key={booking._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <MapPin className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{booking.parkingSpot.spotNumber}</div>
                                <div className="text-sm text-gray-500">{booking.parkingSpot.location}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <Car className="h-5 w-5 text-gray-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{booking.vehicleInfo.licensePlate}</div>
                                <div className="text-sm text-gray-500">
                                  {booking.vehicleInfo.make} {booking.vehicleInfo.model} • {booking.vehicleInfo.color}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <Clock className="h-5 w-5 text-purple-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {formatDate(booking.startTime)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  to {formatDate(booking.endTime)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                <CreditCard className="h-5 w-5 text-green-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  ${booking.totalCost.toFixed(2)}
                                </div>
                                <div className="text-sm">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                                    {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {booking.status === 'active' && (
                                <button
                                  onClick={() => handleCompleteBooking(booking._id)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Complete Booking"
                                >
                                  <CheckCircle size={18} />
                                </button>
                              )}
                              {booking.status === 'active' && (
                                <button
                                  onClick={() => handleCancelBooking(booking._id)}
                                  className="text-yellow-600 hover:text-yellow-900"
                                  title="Cancel Booking"
                                >
                                  <XCircle size={18} />
                                </button>
                              )}
                              <button
                                onClick={() => handleEditBooking(booking)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Edit Booking"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteBooking(booking._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete Booking"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Previous
                    </button>
                    <div className="flex mx-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 mx-1 rounded-md ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === totalPages
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Edit Booking Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Booking</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Parking Spot</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={selectedBooking.parkingSpot.spotNumber}
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={selectedBooking.startTime.slice(0, 16)}
                  onChange={(e) => setSelectedBooking({ ...selectedBooking, startTime: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={selectedBooking.endTime.slice(0, 16)}
                  onChange={(e) => setSelectedBooking({ ...selectedBooking, endTime: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={selectedBooking.vehicleInfo.licensePlate}
                  onChange={(e) => setSelectedBooking({
                    ...selectedBooking,
                    vehicleInfo: { ...selectedBooking.vehicleInfo, licensePlate: e.target.value }
                  })}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => {
                    // Handle save logic here
                    setIsModalOpen(false);
                    toast.success('Booking updated successfully');
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;