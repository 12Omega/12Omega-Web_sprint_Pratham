/**
 * Admin Bookings Management Page Component
 * View and manage all bookings for administrators
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Filter, 
  Search,
  Eye,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Car,
  MapPin,
  User,
  CreditCard
} from 'lucide-react';
import { RootState, AppDispatch } from '../../store/store';
import { fetchBookings, deleteBooking, cancelBooking, completeBooking } from '../../store/slices/bookingsSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminBookingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, loading, pagination } = useSelector((state: RootState) => state.bookings);
  
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchBookings({ 
      page: 1, 
      limit: 20, 
      status: statusFilter,
      // Add payment filter when API supports it
    }));
  }, [dispatch, statusFilter, paymentFilter]);

  const handleDeleteBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      try {
        await dispatch(deleteBooking(bookingId));
        toast.success('Booking deleted successfully');
      } catch (error) {
        toast.error('Failed to delete booking');
      }
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await dispatch(cancelBooking(bookingId));
        toast.success('Booking cancelled successfully');
      } catch (error) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    try {
      await dispatch(completeBooking(bookingId));
      toast.success('Booking completed successfully');
    } catch (error) {
      toast.error('Failed to complete booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = !searchTerm || 
      (typeof booking.user === 'object' && booking.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof booking.parkingSpot === 'object' && booking.parkingSpot.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      booking.vehicleInfo.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPayment = !paymentFilter || booking.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesPayment;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
          <p className="text-gray-600 mt-1">
            View and manage all parking reservations
          </p>
        </div>
        <div className="mt-4 sm:mt-0 text-sm text-gray-500">
          Total: {filteredBookings.length} bookings
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search bookings..."
              className="form-input pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="form-input"
          >
            <option value="">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <button
            onClick={() => {
              setStatusFilter('');
              setPaymentFilter('');
              setSearchTerm('');
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </motion.div>

      {/* Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="large" text="Loading bookings..." />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter || paymentFilter 
                ? 'No bookings match your current filters' 
                : 'No bookings have been made yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User & Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time & Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking, index) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {typeof booking.parkingSpot === 'object' 
                            ? booking.parkingSpot.spotNumber 
                            : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {typeof booking.parkingSpot === 'object' 
                            ? booking.parkingSpot.location 
                            : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400">
                          ID: {booking._id.slice(-6)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {typeof booking.user === 'object' 
                            ? booking.user.name 
                            : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {typeof booking.user === 'object' 
                            ? booking.user.email 
                            : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {booking.vehicleInfo.licensePlate}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900">
                          {formatDateTime(booking.startTime).date}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDateTime(booking.startTime).time} - {formatDateTime(booking.endTime).time}
                        </div>
                        <div className="text-xs text-gray-400">
                          {booking.duration}h duration
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          ${booking.totalCost.toFixed(2)}
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {booking.status === 'active' && (
                          <>
                            <button
                              onClick={() => handleCompleteBooking(booking._id)}
                              className="text-green-600 hover:text-green-900"
                              title="Complete Booking"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Cancel Booking"
                            >
                              <AlertCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Booking"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* User Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      User Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">
                          {typeof selectedBooking.user === 'object' 
                            ? selectedBooking.user.name 
                            : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="ml-2 font-medium">
                          {typeof selectedBooking.user === 'object' 
                            ? selectedBooking.user.email 
                            : 'N/A'}
                        </span>
                      </div>
                      {typeof selectedBooking.user === 'object' && selectedBooking.user.phone && (
                        <div>
                          <span className="text-sm text-gray-600">Phone:</span>
                          <span className="ml-2 font-medium">{selectedBooking.user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <Car className="w-5 h-5 mr-2" />
                      Vehicle Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">License Plate:</span>
                        <span className="ml-2 font-medium">{selectedBooking.vehicleInfo.licensePlate}</span>
                      </div>
                      {selectedBooking.vehicleInfo.make && (
                        <div>
                          <span className="text-sm text-gray-600">Make & Model:</span>
                          <span className="ml-2 font-medium">
                            {selectedBooking.vehicleInfo.make} {selectedBooking.vehicleInfo.model}
                          </span>
                        </div>
                      )}
                      {selectedBooking.vehicleInfo.color && (
                        <div>
                          <span className="text-sm text-gray-600">Color:</span>
                          <span className="ml-2 font-medium">{selectedBooking.vehicleInfo.color}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Parking Spot Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Parking Spot
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Spot Number:</span>
                        <span className="ml-2 font-medium">
                          {typeof selectedBooking.parkingSpot === 'object' 
                            ? selectedBooking.parkingSpot.spotNumber 
                            : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Location:</span>
                        <span className="ml-2 font-medium">
                          {typeof selectedBooking.parkingSpot === 'object' 
                            ? selectedBooking.parkingSpot.location 
                            : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Address:</span>
                        <span className="ml-2 font-medium">
                          {typeof selectedBooking.parkingSpot === 'object' 
                            ? selectedBooking.parkingSpot.address 
                            : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Type:</span>
                        <span className="ml-2 font-medium capitalize">
                          {typeof selectedBooking.parkingSpot === 'object' 
                            ? selectedBooking.parkingSpot.type 
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking & Payment Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Booking & Payment
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Start Time:</span>
                        <span className="ml-2 font-medium">
                          {formatDateTime(selectedBooking.startTime).date} at {formatDateTime(selectedBooking.startTime).time}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">End Time:</span>
                        <span className="ml-2 font-medium">
                          {formatDateTime(selectedBooking.endTime).date} at {formatDateTime(selectedBooking.endTime).time}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Duration:</span>
                        <span className="ml-2 font-medium">{selectedBooking.duration} hours</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Total Cost:</span>
                        <span className="ml-2 font-medium text-lg">${selectedBooking.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center space-x-4 pt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedBooking.status)}`}>
                          {selectedBooking.status}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                          {selectedBooking.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedBooking.notes}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                Close
              </button>
              {selectedBooking.status === 'active' && (
                <>
                  <button
                    onClick={() => {
                      handleCompleteBooking(selectedBooking._id);
                      setShowModal(false);
                    }}
                    className="btn-success"
                  >
                    Complete Booking
                  </button>
                  <button
                    onClick={() => {
                      handleCancelBooking(selectedBooking._id);
                      setShowModal(false);
                    }}
                    className="btn-danger"
                  >
                    Cancel Booking
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingsPage;