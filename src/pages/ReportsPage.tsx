import React, { useState } from 'react';
import { 
  BarChart, PieChart, Calendar, Download, FileText, 
  Filter, ChevronDown, ChevronUp, Printer
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { useAuth } from '../contexts/AuthContext';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';
import { reportsData } from '../utils/dummyData';

const ReportsPage: React.FC = () => {
  const { logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeReport, setActiveReport] = useState<string>('usage');
  const [dateRange, setDateRange] = useState<string>('last30days');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  // Use our dummy data from the reports data
  const usageData = reportsData.occupancyByHour.map(item => ({
    name: item.hour.split(':')[0],
    hours: item.occupancyRate / 5 // Convert occupancy rate to hours for demonstration
  }));

  const revenueData = reportsData.revenueByDay.map(item => ({
    name: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 3),
    amount: item.revenue / 10 // Scale down for better visualization
  }));

  const spotTypeData = [
    { name: 'Standard', value: 60 },
    { name: 'Compact', value: 25 },
    { name: 'Handicap', value: 10 },
    { name: 'Electric', value: 15 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleExportReport = (format: string) => {
    // In a real application, you would generate and download the report
    console.log(`Exporting ${activeReport} report as ${format}`);
  };

  const handlePrintReport = () => {
    // In a real application, you would print the report
    window.print();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <DashboardHeader onLogout={logout} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExportReport('pdf')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Download size={18} className="mr-2" />
                Export PDF
              </button>
              <button
                onClick={() => handlePrintReport()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
              >
                <Printer size={18} className="mr-2" />
                Print
              </button>
            </div>
          </div>

          {/* Report Selection Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="flex overflow-x-auto">
              <button
                className={`py-4 px-6 text-center font-medium whitespace-nowrap ${
                  activeReport === 'usage'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveReport('usage')}
              >
                Usage Report
              </button>
              <button
                className={`py-4 px-6 text-center font-medium whitespace-nowrap ${
                  activeReport === 'revenue'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveReport('revenue')}
              >
                Revenue Report
              </button>
              <button
                className={`py-4 px-6 text-center font-medium whitespace-nowrap ${
                  activeReport === 'spots'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveReport('spots')}
              >
                Parking Spots Analysis
              </button>
              <button
                className={`py-4 px-6 text-center font-medium whitespace-nowrap ${
                  activeReport === 'custom'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveReport('custom')}
              >
                Custom Report
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last90days">Last 90 Days</option>
                  <option value="thisyear">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Filter size={18} className="mr-2" />
                  More Filters
                  {showFilters ? <ChevronUp size={18} className="ml-2" /> : <ChevronDown size={18} className="ml-2" />}
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Additional filters based on report type */}
                {activeReport === 'usage' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Spot Type</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="all">All Types</option>
                        <option value="standard">Standard</option>
                        <option value="compact">Compact</option>
                        <option value="handicap">Handicap</option>
                        <option value="electric">Electric</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="all">All Locations</option>
                        <option value="level1">Level 1</option>
                        <option value="level2">Level 2</option>
                        <option value="level3">Level 3</option>
                      </select>
                    </div>
                  </>
                )}
                {activeReport === 'revenue' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="all">All Methods</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="debit_card">Debit Card</option>
                        <option value="paypal">PayPal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Group By</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="day">Day</option>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Report Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="ml-4 text-gray-700">Loading report data...</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {activeReport === 'usage' && 'Parking Usage Report'}
                    {activeReport === 'revenue' && 'Revenue Report'}
                    {activeReport === 'spots' && 'Parking Spots Analysis'}
                    {activeReport === 'custom' && 'Custom Report'}
                  </h2>
                  <p className="text-gray-600">
                    {dateRange === 'last7days' && 'Last 7 Days'}
                    {dateRange === 'last30days' && 'Last 30 Days'}
                    {dateRange === 'last90days' && 'Last 90 Days'}
                    {dateRange === 'thisyear' && 'This Year'}
                    {dateRange === 'custom' && 'Custom Date Range'}
                  </p>
                </div>

                {activeReport === 'usage' && (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={usageData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} hours`, 'Usage']} />
                        <Bar dataKey="hours" fill="#4F46E5" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600">Total Hours</p>
                        <p className="text-2xl font-bold text-blue-900">150</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-600">Average Daily</p>
                        <p className="text-2xl font-bold text-green-900">21.4</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-purple-600">Peak Day</p>
                        <p className="text-2xl font-bold text-purple-900">Saturday</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-yellow-600">Occupancy Rate</p>
                        <p className="text-2xl font-bold text-yellow-900">78%</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeReport === 'revenue' && (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={revenueData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                        <Bar dataKey="amount" fill="#10B981" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-900">$750</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600">Average Daily</p>
                        <p className="text-2xl font-bold text-blue-900">$107.14</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-purple-600">Peak Day</p>
                        <p className="text-2xl font-bold text-purple-900">Saturday</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-yellow-600">Growth</p>
                        <p className="text-2xl font-bold text-yellow-900">+12%</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeReport === 'spots' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={spotTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {spotTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} spots`, 'Count']} />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Spot Utilization Summary</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Standard</span>
                            <span className="text-sm font-medium text-gray-700">75%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Compact</span>
                            <span className="text-sm font-medium text-gray-700">60%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Handicap</span>
                            <span className="text-sm font-medium text-gray-700">45%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Electric</span>
                            <span className="text-sm font-medium text-gray-700">85%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeReport === 'custom' && (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Custom Report Builder</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Select the data points and metrics you want to include in your custom report.
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Build Custom Report
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;