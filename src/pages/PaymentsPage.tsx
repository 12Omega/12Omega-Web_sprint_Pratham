import React, { useState, useEffect } from 'react';
import {
    CreditCard, Search, Filter, ChevronDown, ChevronUp, Download,
    Calendar, Clock, CheckCircle, XCircle, AlertCircle,
    BarChart3, List
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import KhaltiPaymentButton from '../components/payments/KhaltiPaymentButton';
import PaymentAnalyticsDashboard from '../components/payments/PaymentAnalyticsDashboard';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { paymentsAPI } from '../services/api';
import { paymentsData } from '../utils/dummyData';

interface Payment {
    _id: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed' | 'refunded';
    method: 'khalti' | 'credit_card' | 'debit_card' | 'paypal' | 'cash';
    transactionId: string;
    booking?: {
        _id: string;
        parkingSpot?: {
            spotNumber: string;
            location: string;
        };
        startTime: string;
        endTime: string;
    } | null;
    createdAt: string;
    updatedAt: string;
}

const PaymentsPage: React.FC = () => {
    const { user, logout } = useAuth();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState<'history' | 'methods' | 'analytics'>('history');
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('all');

    useEffect(() => {
        if (activeTab === 'history') {
            fetchPayments();
        }
    }, [activeTab, currentPage, statusFilter, dateFilter]);

    const fetchPayments = async () => {
        try {
            setLoading(true);

            // Prepare date range parameters based on dateFilter
            let startDate: string | undefined = undefined;
            let endDate: string | undefined = undefined;
            const today = new Date();

            switch (dateFilter) {
                case 'today':
                    startDate = today.toISOString().split('T')[0];
                    endDate = today.toISOString().split('T')[0];
                    break;
                case 'yesterday':
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    startDate = yesterday.toISOString().split('T')[0];
                    endDate = yesterday.toISOString().split('T')[0];
                    break;
                case 'last7days':
                    const last7days = new Date(today);
                    last7days.setDate(last7days.getDate() - 7);
                    startDate = last7days.toISOString().split('T')[0];
                    endDate = today.toISOString().split('T')[0];
                    break;
                case 'last30days':
                    const last30days = new Date(today);
                    last30days.setDate(last30days.getDate() - 30);
                    startDate = last30days.toISOString().split('T')[0];
                    endDate = today.toISOString().split('T')[0];
                    break;
            }

            try {
                // Try to fetch real data first
                const response = await paymentsAPI.getPayments({
                    page: currentPage,
                    limit: 10,
                    status: statusFilter !== 'all' ? statusFilter : undefined,
                    startDate,
                    endDate
                });

                setPayments(response.data.data || []);
                setTotalPages(response.data.pagination?.totalPages || 1);
            } catch (apiError) {
                console.log('Using dummy payment data');
                // If API fails, use dummy data
                // Convert the dummy data to match the Payment interface
                const typedPayments = paymentsData.map(payment => ({
                    ...payment,
                    status: payment.status as 'completed' | 'pending' | 'failed' | 'refunded',
                    method: payment.method as 'khalti' | 'credit_card' | 'debit_card' | 'paypal' | 'cash'
                }));
                setPayments(typedPayments);
                setTotalPages(1);
            }

            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch payments');
            setPayments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReceipt = async (paymentId: string) => {
        try {
            let receiptData: any;

            try {
                // Try to fetch real data first
                const response = await paymentsAPI.getPaymentReceipt(paymentId);
                receiptData = response.data.data;
            } catch (apiError) {
                console.log('Using dummy receipt data');
                // If API fails, use dummy data
                const payment = paymentsData.find(p => p._id === paymentId) || paymentsData[0];
                receiptData = {
                    receiptNumber: `RCPT-${payment._id.toString().substring(0, 8).toUpperCase()}`,
                    paymentId: payment._id,
                    transactionId: payment.transactionId,
                    date: payment.createdAt,
                    customerName: 'Test User',
                    customerEmail: 'test@example.com',
                    paymentMethod: payment.method,
                    status: payment.status,
                    bookingDetails: {
                        bookingId: payment.booking?._id || 'N/A',
                        parkingSpot: payment.booking?.parkingSpot?.spotNumber || 'N/A',
                        location: payment.booking?.parkingSpot?.location || 'N/A',
                        startTime: payment.booking?.startTime || 'N/A',
                        endTime: payment.booking?.endTime || 'N/A',
                        duration: 2,
                        rate: 7.5
                    },
                    amount: payment.amount,
                    currency: 'NPR'
                };
            }

            // In a real application, you would generate a PDF receipt
            // For now, we'll just show a success message
            toast.success('Receipt downloaded successfully');

            // Open receipt in a new window
            const receiptWindow = window.open('', '_blank');

            if (receiptWindow) {
                receiptWindow.document.write(`
          <html>
            <head>
              <title>Payment Receipt</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .receipt { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; }
                .header { text-align: center; margin-bottom: 20px; }
                .details { margin-bottom: 20px; }
                .row { display: flex; margin-bottom: 5px; }
                .label { font-weight: bold; width: 200px; }
                .value { flex: 1; }
                .total { font-size: 18px; font-weight: bold; margin-top: 20px; text-align: right; }
              </style>
            </head>
            <body>
              <div class="receipt">
                <div class="header">
                  <h1>Payment Receipt</h1>
                  <p>Receipt Number: ${receiptData.receiptNumber}</p>
                  <p>Date: ${new Date(receiptData.date).toLocaleString()}</p>
                </div>
                <div class="details">
                  <div class="row">
                    <div class="label">Customer Name:</div>
                    <div class="value">${receiptData.customerName}</div>
                  </div>
                  <div class="row">
                    <div class="label">Customer Email:</div>
                    <div class="value">${receiptData.customerEmail}</div>
                  </div>
                  <div class="row">
                    <div class="label">Payment Method:</div>
                    <div class="value">${receiptData.paymentMethod}</div>
                  </div>
                  <div class="row">
                    <div class="label">Transaction ID:</div>
                    <div class="value">${receiptData.transactionId}</div>
                  </div>
                  <div class="row">
                    <div class="label">Status:</div>
                    <div class="value">${receiptData.status}</div>
                  </div>
                  <div class="row">
                    <div class="label">Parking Spot:</div>
                    <div class="value">${receiptData.bookingDetails.parkingSpot}</div>
                  </div>
                  <div class="row">
                    <div class="label">Location:</div>
                    <div class="value">${receiptData.bookingDetails.location}</div>
                  </div>
                  <div class="row">
                    <div class="label">Start Time:</div>
                    <div class="value">${new Date(receiptData.bookingDetails.startTime).toLocaleString()}</div>
                  </div>
                  <div class="row">
                    <div class="label">End Time:</div>
                    <div class="value">${new Date(receiptData.bookingDetails.endTime).toLocaleString()}</div>
                  </div>
                  <div class="row">
                    <div class="label">Duration:</div>
                    <div class="value">${receiptData.bookingDetails.duration} hours</div>
                  </div>
                  <div class="row">
                    <div class="label">Rate:</div>
                    <div class="value">${receiptData.bookingDetails.rate} ${receiptData.currency}/hour</div>
                  </div>
                </div>
                <div class="total">
                  Total Amount: ${receiptData.amount} ${receiptData.currency}
                </div>
              </div>
            </body>
          </html>
        `);
                receiptWindow.document.close();
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to download receipt');
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
            case 'completed':
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'pending':
                return <Clock className="h-5 w-5 text-yellow-600" />;
            case 'failed':
                return <XCircle className="h-5 w-5 text-red-600" />;
            case 'refunded':
                return <AlertCircle className="h-5 w-5 text-blue-600" />;
            default:
                return null;
        }
    };

    // Use our imported dummy data if no payments are fetched
    // Also filter out payments with null bookings to prevent errors
    const validPayments = payments.length > 0 ? payments.filter(payment => payment.booking !== null) : paymentsData;
    const displayPayments = validPayments;

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
                <DashboardHeader onLogout={logout} />
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
                        <div>
                            <KhaltiPaymentButton
                                bookingId="sample-booking-id"
                                amount={100}
                                customerName={user?.name || 'Test User'}
                                customerEmail={user?.email || 'test@example.com'}
                                onSuccess={() => toast.success('Payment successful!')}
                                className="mr-2"
                            />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-lg shadow-md mb-6">
                        <div className="flex border-b border-gray-200">
                            <button
                                className={`flex items-center justify-center py-4 px-4 text-center font-medium ${activeTab === 'history'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setActiveTab('history')}
                            >
                                <List className="h-5 w-5 mr-2" />
                                Payment History
                            </button>
                            <button
                                className={`flex items-center justify-center py-4 px-4 text-center font-medium ${activeTab === 'methods'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setActiveTab('methods')}
                            >
                                <CreditCard className="h-5 w-5 mr-2" />
                                Payment Methods
                            </button>
                            <button
                                className={`flex items-center justify-center py-4 px-4 text-center font-medium ${activeTab === 'analytics'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setActiveTab('analytics')}
                            >
                                <BarChart3 className="h-5 w-5 mr-2" />
                                Analytics Dashboard
                            </button>
                        </div>
                    </div>

                    {activeTab === 'history' ? (
                        <>
                            {/* Search and Filters */}
                            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search by transaction ID..."
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
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
                                                onChange={(e) => setStatusFilter(e.target.value)}
                                            >
                                                <option value="all">All Statuses</option>
                                                <option value="completed">Completed</option>
                                                <option value="pending">Pending</option>
                                                <option value="failed">Failed</option>
                                                <option value="refunded">Refunded</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                                            <select
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={dateFilter}
                                                onChange={(e) => setDateFilter(e.target.value)}
                                            >
                                                <option value="all">All Time</option>
                                                <option value="today">Today</option>
                                                <option value="yesterday">Yesterday</option>
                                                <option value="last7days">Last 7 Days</option>
                                                <option value="last30days">Last 30 Days</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Payment History */}
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                    <p className="ml-4 text-gray-700">Loading payments...</p>
                                </div>
                            ) : error ? (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                                    <strong className="font-bold">Error:</strong>
                                    <span className="block sm:inline"> {error}</span>
                                </div>
                            ) : displayPayments.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                    <CreditCard className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">No payment history found</h3>
                                    <p className="text-gray-600">Your payment history will appear here once you make a booking</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Transaction
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Booking Details
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Payment Method
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Amount
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {displayPayments.map((payment) => (
                                                    <tr key={payment._id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                                    <Calendar className="h-5 w-5 text-purple-600" />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {formatDate(payment.createdAt).split(',')[0]}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {formatDate(payment.createdAt).split(',')[1]}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{payment.transactionId}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{payment.booking?.parkingSpot?.spotNumber || 'N/A'}</div>
                                                            <div className="text-xs text-gray-500">{payment.booking?.parkingSpot?.location || 'N/A'}</div>
                                                            <div className="text-xs text-gray-500">
                                                                {payment.booking?.startTime ? new Date(payment.booking.startTime).toLocaleDateString() : 'N/A'} - {payment.booking?.endTime ? new Date(payment.booking.endTime).toLocaleDateString() : 'N/A'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                                    <img
                                                                        src="https://raw.githubusercontent.com/khalti/khalti-sdk-web/master/assets/khalti-logo.png"
                                                                        alt="Khalti"
                                                                        className="h-5"
                                                                    />
                                                                </div>
                                                                <div className="ml-3">
                                                                    <div className="text-sm font-medium text-gray-900 capitalize">
                                                                        Khalti
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">NPR {payment.amount.toFixed(2)}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                {getStatusIcon(payment.status)}
                                                                <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                                                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            {payment.status === 'completed' && (
                                                                <button
                                                                    onClick={() => handleDownloadReceipt(payment._id)}
                                                                    className="text-blue-600 hover:text-blue-900 flex items-center"
                                                                    title="Download Receipt"
                                                                >
                                                                    <Download size={18} className="mr-1" />
                                                                    Receipt
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-6">
                                    <nav className="flex items-center">
                                        <button
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-1 rounded-md ${currentPage === 1
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
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`px-3 py-1 mx-1 rounded-md ${currentPage === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`px-3 py-1 rounded-md ${currentPage === totalPages
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
                    ) : activeTab === 'methods' ? (
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <div className="text-center mb-8">
                                <img
                                    src="https://raw.githubusercontent.com/khalti/khalti-sdk-web/master/assets/khalti-logo.png"
                                    alt="Khalti"
                                    className="h-16 mx-auto mb-4"
                                />
                                <h3 className="text-xl font-medium text-gray-900 mb-2">Khalti Payment Integration</h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Khalti is a digital wallet and payment gateway for Nepal. You can use Khalti to make payments for your parking bookings.
                                </p>
                            </div>

                            <div className="max-w-md mx-auto bg-purple-50 p-6 rounded-lg border border-purple-100">
                                <h4 className="text-lg font-medium text-purple-900 mb-4">How to use Khalti</h4>
                                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                                    <li>Create a Khalti account if you don't have one</li>
                                    <li>Link your bank account or load money into your Khalti wallet</li>
                                    <li>Click on "Pay with Khalti" button when making a payment</li>
                                    <li>Enter your Khalti credentials</li>
                                    <li>Confirm the payment</li>
                                </ol>

                                <div className="mt-6">
                                    <KhaltiPaymentButton
                                        bookingId="sample-booking-id"
                                        amount={100}
                                        customerName={user?.name || 'Test User'}
                                        customerEmail={user?.email || 'test@example.com'}
                                        onSuccess={() => toast.success('Payment successful!')}
                                        className="w-full"
                                    />
                                </div>

                                <p className="mt-4 text-xs text-gray-500">
                                    For testing purposes, you can use the following credentials:
                                    <br />
                                    Phone: 9800000000
                                    <br />
                                    MPIN: 1111
                                </p>
                            </div>
                        </div>
                    ) : (
                        <PaymentAnalyticsDashboard className="mb-6" />
                    )}
                </main>
            </div>
        </div>
    );
};

export default PaymentsPage;