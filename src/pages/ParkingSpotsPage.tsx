import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Search, Filter, ChevronDown, ChevronUp, Edit, Trash2, 
  Plus, DollarSign, Tag, MapPinned, Clock
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { spotsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { parkingSpotsDetailedData } from '../utils/dummyData';

interface ParkingSpot {
  _id: string;
  spotNumber: string;
  location: string;
  address: string;
  type: 'standard' | 'compact' | 'handicap' | 'electric';
  hourlyRate: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  features?: string[];
  description?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
}

const ParkingSpotsPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSpot, setNewSpot] = useState<Partial<ParkingSpot>>({
    spotNumber: '',
    location: '',
    address: '',
    type: 'standard',
    hourlyRate: 5.00,
    status: 'available',
    features: [],
    description: ''
  });

  useEffect(() => {
    fetchSpots();
  }, [currentPage, typeFilter, statusFilter, sortField, sortOrder]);

  const fetchSpots = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 10,
        sortBy: sortField,
        sortOrder: sortOrder
      };

      if (typeFilter !== 'all') {
        params.type = typeFilter;
      }

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      try {
        // Try to fetch real data first
        const response = await spotsAPI.getSpots(params);
        const spotsData = response.data.data?.spots || [];
        setSpots(Array.isArray(spotsData) ? spotsData : []);
        setTotalPages(response.data.data?.pagination?.totalPages || 1);
      } catch (apiError) {
        console.log('Using dummy parking spots data');
        // If API fails, use dummy data
        // Convert the parkingSpotsDetailedData to match the ParkingSpot interface
        const dummySpots: ParkingSpot[] = parkingSpotsDetailedData.map(spot => ({
          _id: spot._id,
          spotNumber: spot.spotNumber,
          location: spot.location,
          type: spot.type as 'standard' | 'compact' | 'handicap' | 'electric',
          hourlyRate: spot.hourlyRate,
          status: spot.status as 'available' | 'occupied' | 'maintenance' | 'reserved',
          features: spot.features,
          description: spot.dimensions ? `${spot.dimensions.length}m x ${spot.dimensions.width}m` : undefined,
          createdAt: spot.createdAt
        }));
        
        // Apply filters to dummy data
        let filteredDummySpots = [...dummySpots];
        
        if (typeFilter !== 'all') {
          filteredDummySpots = filteredDummySpots.filter(spot => spot.type === typeFilter);
        }
        
        if (statusFilter !== 'all') {
          filteredDummySpots = filteredDummySpots.filter(spot => spot.status === statusFilter);
        }
        
        setSpots(filteredDummySpots);
        setTotalPages(1);
      }
      
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch parking spots');
      setSpots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSpots();
  };

  const handleTypeChange = (type: string) => {
    setTypeFilter(type);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditSpot = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
    setIsModalOpen(true);
  };

  const handleDeleteSpot = async (spotId: string) => {
    if (window.confirm('Are you sure you want to delete this parking spot?')) {
      try {
        await spotsAPI.deleteSpot(spotId);
        toast.success('Parking spot deleted successfully');
        fetchSpots();
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete parking spot');
      }
    }
  };

  const handleUpdateSpotStatus = async (spotId: string, status: string) => {
    try {
      await spotsAPI.updateSpotStatus(spotId, status);
      toast.success(`Parking spot status updated to ${status}`);
      fetchSpots();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update parking spot status');
    }
  };

  const handleCreateSpot = async () => {
    try {
      await spotsAPI.createSpot(newSpot);
      toast.success('Parking spot created successfully');
      setIsCreateModalOpen(false);
      setNewSpot({
        name: '',
        location: '',
        type: 'standard',
        rate: 5.00,
        status: 'available',
        features: [],
        description: ''
      });
      fetchSpots();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create parking spot');
    }
  };

  const handleUpdateSpot = async () => {
    if (!selectedSpot) return;
    
    try {
      await spotsAPI.updateSpot(selectedSpot._id, selectedSpot);
      toast.success('Parking spot updated successfully');
      setIsModalOpen(false);
      fetchSpots();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update parking spot');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'reserved':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'standard':
        return <MapPin className="h-5 w-5" />;
      case 'compact':
        return <MapPin className="h-4 w-4" />;
      case 'handicap':
        return <MapPin className="h-5 w-5" />;
      case 'electric':
        return <MapPin className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  const filteredSpots = Array.isArray(spots) ? spots.filter(spot => 
    (spot.spotNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (spot.location?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  ) : [];

  // Use our filtered spots
  const displaySpots = spots.length > 0 ? filteredSpots : [];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <DashboardHeader onLogout={logout} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Parking Spots</h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Add New Spot
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
                    placeholder="Search by name or location..."
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
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={typeFilter}
                    onChange={(e) => handleTypeChange(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="standard">Standard</option>
                    <option value="compact">Compact</option>
                    <option value="handicap">Handicap</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={statusFilter}
                    onChange={(e) => handleStatusChange(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="reserved">Reserved</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={sortField}
                    onChange={(e) => handleSort(e.target.value)}
                  >
                    <option value="name">Name</option>
                    <option value="location">Location</option>
                    <option value="type">Type</option>
                    <option value="rate">Rate</option>
                    <option value="status">Status</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Parking Spots Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="ml-4 text-gray-700">Loading parking spots...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displaySpots.map((spot) => (
                  <div key={spot._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full ${spot.status === 'available' ? 'bg-green-100' : spot.status === 'occupied' ? 'bg-red-100' : spot.status === 'maintenance' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                            {getTypeIcon(spot.type)}
                          </div>
                          <div className="ml-3">
                            <h3 className="text-lg font-semibold text-gray-900">{spot.spotNumber}</h3>
                            <p className="text-sm text-gray-500">{spot.location}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(spot.status)}`}>
                          {spot.status.charAt(0).toUpperCase() + spot.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="mt-4 flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="ml-1 text-gray-700 font-medium">${spot.hourlyRate.toFixed(2)}/hr</span>
                      </div>
                      
                      <div className="mt-2 flex items-center">
                        <Tag className="h-4 w-4 text-gray-500" />
                        <span className="ml-1 text-gray-700">{spot.type.charAt(0).toUpperCase() + spot.type.slice(1)}</span>
                      </div>
                      
                      {spot.features && spot.features.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {spot.features.map((feature, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {spot.description && (
                        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{spot.description}</p>
                      )}
                      
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditSpot(spot)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit Spot"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteSpot(spot._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete Spot"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div>
                          <select
                            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={spot.status}
                            onChange={(e) => handleUpdateSpotStatus(spot._id, e.target.value)}
                          >
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="reserved">Reserved</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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

      {/* Edit Spot Modal */}
      {isModalOpen && selectedSpot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Parking Spot</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={selectedSpot.spotNumber}
                  onChange={(e) => setSelectedSpot({ ...selectedSpot, spotNumber: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={selectedSpot.location}
                  onChange={(e) => setSelectedSpot({ ...selectedSpot, location: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={selectedSpot.type}
                  onChange={(e) => setSelectedSpot({ ...selectedSpot, type: e.target.value as any })}
                >
                  <option value="standard">Standard</option>
                  <option value="compact">Compact</option>
                  <option value="handicap">Handicap</option>
                  <option value="electric">Electric</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rate ($/hr)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={selectedSpot.hourlyRate}
                  onChange={(e) => setSelectedSpot({ ...selectedSpot, hourlyRate: parseFloat(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={selectedSpot.status}
                  onChange={(e) => setSelectedSpot({ ...selectedSpot, status: e.target.value as any })}
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="reserved">Reserved</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                  value={selectedSpot.description || ''}
                  onChange={(e) => setSelectedSpot({ ...selectedSpot, description: e.target.value })}
                ></textarea>
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
                  onClick={handleUpdateSpot}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Spot Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Parking Spot</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newSpot.spotNumber}
                  onChange={(e) => setNewSpot({ ...newSpot, spotNumber: e.target.value })}
                  placeholder="e.g. Spot A1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newSpot.location}
                  onChange={(e) => setNewSpot({ ...newSpot, location: e.target.value })}
                  placeholder="e.g. Level 1, Section A"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newSpot.type}
                  onChange={(e) => setNewSpot({ ...newSpot, type: e.target.value as any })}
                >
                  <option value="standard">Standard</option>
                  <option value="compact">Compact</option>
                  <option value="handicap">Handicap</option>
                  <option value="electric">Electric</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rate ($/hr)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newSpot.hourlyRate}
                  onChange={(e) => setNewSpot({ ...newSpot, hourlyRate: parseFloat(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newSpot.status}
                  onChange={(e) => setNewSpot({ ...newSpot, status: e.target.value as any })}
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="reserved">Reserved</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newSpot.features?.join(', ')}
                  onChange={(e) => setNewSpot({ ...newSpot, features: e.target.value.split(',').map(f => f.trim()) })}
                  placeholder="e.g. Covered, Security Camera, Near Elevator"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                  value={newSpot.description}
                  onChange={(e) => setNewSpot({ ...newSpot, description: e.target.value })}
                  placeholder="Describe the parking spot..."
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={handleCreateSpot}
                >
                  Create Spot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingSpotsPage;