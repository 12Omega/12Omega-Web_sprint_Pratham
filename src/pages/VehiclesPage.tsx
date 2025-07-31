import React, { useState, useEffect } from 'react';
import { 
  Car, Search, Filter, ChevronDown, ChevronUp, Edit, Trash2, 
  Plus, Tag, Clock
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { vehiclesData } from '../utils/dummyData';

interface Vehicle {
  _id: string;
  licensePlate: string;
  make?: string;
  model?: string;
  color?: string;
  year?: number;
  type: 'sedan' | 'suv' | 'truck' | 'compact' | 'other';
  isDefault: boolean;
  createdAt: string;
}

const VehiclesPage: React.FC = () => {
  const { logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    licensePlate: '',
    make: '',
    model: '',
    color: '',
    year: new Date().getFullYear(),
    type: 'sedan',
    isDefault: false
  });

  // Convert our dummy data to match the Vehicle interface
  const dummyVehicles: Vehicle[] = vehiclesData.map((vehicle, index) => ({
    _id: vehicle._id,
    licensePlate: vehicle.licensePlate,
    make: vehicle.make,
    model: vehicle.model,
    color: vehicle.color,
    year: parseInt(vehicle.createdAt.substring(0, 4)), // Extract year from createdAt
    type: (index % 4 === 0) ? 'sedan' : 
          (index % 4 === 1) ? 'suv' : 
          (index % 4 === 2) ? 'truck' : 'compact',
    isDefault: index === 0, // First vehicle is default
    createdAt: vehicle.createdAt
  }));

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      // In a real application, you would fetch vehicles from an API
      // For now, we'll use our dummy data
      setVehicles(dummyVehicles);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vehicles');
      setVehicles([]);
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
    // In a real application, you would fetch filtered vehicles from an API
  };

  const handleTypeChange = (type: string) => {
    setTypeFilter(type);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      // In a real application, you would delete the vehicle via an API
      const updatedVehicles = vehicles.filter(v => v._id !== vehicleId);
      setVehicles(updatedVehicles);
      toast.success('Vehicle deleted successfully');
    }
  };

  const handleSetDefaultVehicle = (vehicleId: string) => {
    // In a real application, you would update the default vehicle via an API
    const updatedVehicles = vehicles.map(v => ({
      ...v,
      isDefault: v._id === vehicleId
    }));
    setVehicles(updatedVehicles);
    toast.success('Default vehicle updated');
  };

  const handleCreateVehicle = () => {
    // In a real application, you would create the vehicle via an API
    const newId = Math.random().toString(36).substring(2, 9);
    const createdVehicle: Vehicle = {
      _id: newId,
      licensePlate: newVehicle.licensePlate || '',
      make: newVehicle.make,
      model: newVehicle.model,
      color: newVehicle.color,
      year: newVehicle.year,
      type: newVehicle.type as 'sedan' | 'suv' | 'truck' | 'compact' | 'other',
      isDefault: newVehicle.isDefault || false,
      createdAt: new Date().toISOString()
    };
    
    setVehicles([...vehicles, createdVehicle]);
    setIsCreateModalOpen(false);
    setNewVehicle({
      licensePlate: '',
      make: '',
      model: '',
      color: '',
      year: new Date().getFullYear(),
      type: 'sedan',
      isDefault: false
    });
    toast.success('Vehicle added successfully');
  };

  const handleUpdateVehicle = () => {
    if (!selectedVehicle) return;
    
    // In a real application, you would update the vehicle via an API
    const updatedVehicles = vehicles.map(v => 
      v._id === selectedVehicle._id ? selectedVehicle : v
    );
    setVehicles(updatedVehicles);
    setIsModalOpen(false);
    toast.success('Vehicle updated successfully');
  };

  const getVehicleTypeIcon = (type: string) => {
    switch (type) {
      case 'sedan':
        return <Car className="h-5 w-5" />;
      case 'suv':
        return <Car className="h-5 w-5" />;
      case 'truck':
        return <Car className="h-5 w-5" />;
      case 'compact':
        return <Car className="h-5 w-5" />;
      default:
        return <Car className="h-5 w-5" />;
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle.make && vehicle.make.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehicle.model && vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Sort vehicles
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'licensePlate') {
      comparison = a.licensePlate.localeCompare(b.licensePlate);
    } else if (sortField === 'make') {
      comparison = (a.make || '').localeCompare(b.make || '');
    } else if (sortField === 'model') {
      comparison = (a.model || '').localeCompare(b.model || '');
    } else if (sortField === 'year') {
      comparison = (a.year || 0) - (b.year || 0);
    } else if (sortField === 'createdAt') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <DashboardHeader onLogout={logout} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Add Vehicle
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
                    placeholder="Search by license plate, make, or model..."
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={typeFilter}
                    onChange={(e) => handleTypeChange(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="truck">Truck</option>
                    <option value="compact">Compact</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={sortField}
                    onChange={(e) => handleSort(e.target.value)}
                  >
                    <option value="licensePlate">License Plate</option>
                    <option value="make">Make</option>
                    <option value="model">Model</option>
                    <option value="year">Year</option>
                    <option value="createdAt">Date Added</option>
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

          {/* Vehicles Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="ml-4 text-gray-700">Loading vehicles...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          ) : sortedVehicles.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No vehicles found</h3>
              <p className="text-gray-600 mb-6">Add your first vehicle to get started</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Add Vehicle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedVehicles.map((vehicle) => (
                <div key={vehicle._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-blue-100">
                          {getVehicleTypeIcon(vehicle.type)}
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <h3 className="text-lg font-semibold text-gray-900">{vehicle.licensePlate}</h3>
                            {vehicle.isDefault && (
                              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {vehicle.make} {vehicle.model}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Color</p>
                        <p className="text-sm font-medium text-gray-700">{vehicle.color || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Year</p>
                        <p className="text-sm font-medium text-gray-700">{vehicle.year || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Type</p>
                        <p className="text-sm font-medium text-gray-700 capitalize">{vehicle.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Added</p>
                        <p className="text-sm font-medium text-gray-700">
                          {new Date(vehicle.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditVehicle(vehicle)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Edit Vehicle"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete Vehicle"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {!vehicle.isDefault && (
                        <button
                          onClick={() => handleSetDefaultVehicle(vehicle._id)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Edit Vehicle Modal */}
      {isModalOpen && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Vehicle</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={selectedVehicle.licensePlate}
                  onChange={(e) => setSelectedVehicle({ ...selectedVehicle, licensePlate: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={selectedVehicle.make || ''}
                  onChange={(e) => setSelectedVehicle({ ...selectedVehicle, make: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={selectedVehicle.model || ''}
                  onChange={(e) => setSelectedVehicle({ ...selectedVehicle, model: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={selectedVehicle.color || ''}
                    onChange={(e) => setSelectedVehicle({ ...selectedVehicle, color: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={selectedVehicle.year || ''}
                    onChange={(e) => setSelectedVehicle({ ...selectedVehicle, year: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={selectedVehicle.type}
                  onChange={(e) => setSelectedVehicle({ ...selectedVehicle, type: e.target.value as any })}
                >
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="truck">Truck</option>
                  <option value="compact">Compact</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={selectedVehicle.isDefault}
                  onChange={(e) => setSelectedVehicle({ ...selectedVehicle, isDefault: e.target.checked })}
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                  Set as default vehicle
                </label>
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
                  onClick={handleUpdateVehicle}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Vehicle Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Vehicle</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">License Plate *</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newVehicle.licensePlate}
                  onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
                  placeholder="e.g. ABC123"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newVehicle.make}
                  onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                  placeholder="e.g. Toyota"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                  placeholder="e.g. Camry"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={newVehicle.color}
                    onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                    placeholder="e.g. Blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newVehicle.type}
                  onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value as any })}
                >
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="truck">Truck</option>
                  <option value="compact">Compact</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="newIsDefault"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={newVehicle.isDefault}
                  onChange={(e) => setNewVehicle({ ...newVehicle, isDefault: e.target.checked })}
                />
                <label htmlFor="newIsDefault" className="ml-2 block text-sm text-gray-700">
                  Set as default vehicle
                </label>
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
                  onClick={handleCreateVehicle}
                  disabled={!newVehicle.licensePlate}
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesPage;