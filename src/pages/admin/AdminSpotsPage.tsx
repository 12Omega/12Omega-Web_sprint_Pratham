/**
 * Admin Spots Management Page Component
 * Manage parking spots for administrators
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  MapPin,
  Filter,
  Search,
  X,
  Save
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { RootState, AppDispatch } from '../../store/store';
import { 
  fetchSpots, 
  createSpot, 
  updateSpot, 
  deleteSpot,
  updateSpotStatus,
  setFilters,
  clearFilters
} from '../../store/slices/spotsSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface SpotFormData {
  spotNumber: string;
  location: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  type: 'standard' | 'compact' | 'handicap' | 'electric';
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  hourlyRate: number;
  features: string[];
  description?: string;
}

const AdminSpotsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { spots, loading, pagination, filters } = useSelector((state: RootState) => state.spots);
  
  const [showModal, setShowModal] = useState(false);
  const [editingSpot, setEditingSpot] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<SpotFormData>();

  const watchedFeatures = watch('features') || [];

  useEffect(() => {
    dispatch(fetchSpots({ page: 1, limit: 20, ...filters }));
  }, [dispatch, filters]);

  const handleCreateSpot = () => {
    setEditingSpot(null);
    reset({
      spotNumber: '',
      location: '',
      address: '',
      coordinates: { latitude: 0, longitude: 0 },
      type: 'standard',
      status: 'available',
      hourlyRate: 5,
      features: [],
      description: ''
    });
    setShowModal(true);
  };

  const handleEditSpot = (spot: any) => {
    setEditingSpot(spot);
    reset({
      spotNumber: spot.spotNumber,
      location: spot.location,
      address: spot.address,
      coordinates: spot.coordinates,
      type: spot.type,
      status: spot.status,
      hourlyRate: spot.hourlyRate,
      features: spot.features || [],
      description: spot.description || ''
    });
    setShowModal(true);
  };

  const handleDeleteSpot = async (spotId: string) => {
    if (window.confirm('Are you sure you want to delete this parking spot?')) {
      try {
        await dispatch(deleteSpot(spotId));
        toast.success('Parking spot deleted successfully');
      } catch (error) {
        toast.error('Failed to delete parking spot');
      }
    }
  };

  const handleStatusChange = async (spotId: string, status: string) => {
    try {
      await dispatch(updateSpotStatus({ spotId, status }));
      toast.success('Spot status updated successfully');
    } catch (error) {
      toast.error('Failed to update spot status');
    }
  };

  const onSubmit = async (data: SpotFormData) => {
    try {
      if (editingSpot) {
        await dispatch(updateSpot({ spotId: editingSpot._id, spotData: data }));
        toast.success('Parking spot updated successfully');
      } else {
        await dispatch(createSpot(data));
        toast.success('Parking spot created successfully');
      }
      setShowModal(false);
      reset();
    } catch (error) {
      toast.error(editingSpot ? 'Failed to update parking spot' : 'Failed to create parking spot');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilters({ location: searchTerm }));
  };

  const handleFilterChange = (key: string, value: string) => {
    dispatch(setFilters({ [key]: value }));
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
    setSearchTerm('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'compact': return 'bg-yellow-100 text-yellow-800';
      case 'handicap': return 'bg-purple-100 text-purple-800';
      case 'electric': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addFeature = (feature: string) => {
    if (feature && !watchedFeatures.includes(feature)) {
      setValue('features', [...watchedFeatures, feature]);
    }
  };

  const removeFeature = (feature: string) => {
    setValue('features', watchedFeatures.filter(f => f !== feature));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Parking Spots</h1>
          <p className="text-gray-600 mt-1">
            Create, edit, and manage parking spots
          </p>
        </div>
        <button
          onClick={handleCreateSpot}
          className="btn-primary flex items-center mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Spot
        </button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by location..."
              className="form-input pl-10 w-full"
            />
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </form>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t border-gray-200 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div>
              <label className="form-label">Type</label>
              <select
                value={filters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="form-input"
              >
                <option value="">All Types</option>
                <option value="standard">Standard</option>
                <option value="compact">Compact</option>
                <option value="handicap">Handicap</option>
                <option value="electric">Electric</option>
              </select>
            </div>
            <div>
              <label className="form-label">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="form-input"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="form-label">Min Rate ($/hr)</label>
              <input
                type="number"
                value={filters.minRate || ''}
                onChange={(e) => handleFilterChange('minRate', e.target.value)}
                className="form-input"
                placeholder="0"
                min="0"
                step="0.5"
              />
            </div>
            <div>
              <label className="form-label">Max Rate ($/hr)</label>
              <input
                type="number"
                value={filters.maxRate || ''}
                onChange={(e) => handleFilterChange('maxRate', e.target.value)}
                className="form-input"
                placeholder="100"
                min="0"
                step="0.5"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
              <button
                type="button"
                onClick={clearAllFilters}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Spots Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="large" text="Loading parking spots..." />
          </div>
        ) : spots.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No parking spots found</h3>
            <p className="text-gray-600 mb-4">
              Create your first parking spot to get started
            </p>
            <button onClick={handleCreateSpot} className="btn-primary">
              Add New Spot
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {spots.map((spot, index) => (
                  <motion.tr
                    key={spot._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {spot.spotNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {spot._id.slice(-6)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {spot.location}
                        </div>
                        <div className="text-sm text-gray-500">
                          {spot.address}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(spot.type)}`}>
                        {spot.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={spot.status}
                        onChange={(e) => handleStatusChange(spot._id, e.target.value)}
                        className={`text-xs font-medium rounded-full border-0 ${getStatusColor(spot.status)}`}
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="reserved">Reserved</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${spot.hourlyRate}/hr
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditSpot(spot)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSpot(spot._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingSpot ? 'Edit Parking Spot' : 'Create New Parking Spot'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Spot Number *</label>
                  <input
                    {...register('spotNumber', { required: 'Spot number is required' })}
                    type="text"
                    className={`form-input ${errors.spotNumber ? 'border-red-500' : ''}`}
                    placeholder="e.g., A-001"
                  />
                  {errors.spotNumber && (
                    <p className="form-error">{errors.spotNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Hourly Rate *</label>
                  <input
                    {...register('hourlyRate', { 
                      required: 'Hourly rate is required',
                      min: { value: 0, message: 'Rate must be positive' }
                    })}
                    type="number"
                    step="0.5"
                    min="0"
                    className={`form-input ${errors.hourlyRate ? 'border-red-500' : ''}`}
                    placeholder="5.00"
                  />
                  {errors.hourlyRate && (
                    <p className="form-error">{errors.hourlyRate.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Type *</label>
                  <select
                    {...register('type', { required: 'Type is required' })}
                    className={`form-input ${errors.type ? 'border-red-500' : ''}`}
                  >
                    <option value="standard">Standard</option>
                    <option value="compact">Compact</option>
                    <option value="handicap">Handicap</option>
                    <option value="electric">Electric</option>
                  </select>
                  {errors.type && (
                    <p className="form-error">{errors.type.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Status *</label>
                  <select
                    {...register('status', { required: 'Status is required' })}
                    className={`form-input ${errors.status ? 'border-red-500' : ''}`}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                  {errors.status && (
                    <p className="form-error">{errors.status.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="form-label">Location *</label>
                <input
                  {...register('location', { required: 'Location is required' })}
                  type="text"
                  className={`form-input ${errors.location ? 'border-red-500' : ''}`}
                  placeholder="e.g., Downtown Mall"
                />
                {errors.location && (
                  <p className="form-error">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Address *</label>
                <input
                  {...register('address', { required: 'Address is required' })}
                  type="text"
                  className={`form-input ${errors.address ? 'border-red-500' : ''}`}
                  placeholder="e.g., 123 Main Street, City, State"
                />
                {errors.address && (
                  <p className="form-error">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Latitude *</label>
                  <input
                    {...register('coordinates.latitude', { 
                      required: 'Latitude is required',
                      min: { value: -90, message: 'Invalid latitude' },
                      max: { value: 90, message: 'Invalid latitude' }
                    })}
                    type="number"
                    step="any"
                    className={`form-input ${errors.coordinates?.latitude ? 'border-red-500' : ''}`}
                    placeholder="40.7128"
                  />
                  {errors.coordinates?.latitude && (
                    <p className="form-error">{errors.coordinates.latitude.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Longitude *</label>
                  <input
                    {...register('coordinates.longitude', { 
                      required: 'Longitude is required',
                      min: { value: -180, message: 'Invalid longitude' },
                      max: { value: 180, message: 'Invalid longitude' }
                    })}
                    type="number"
                    step="any"
                    className={`form-input ${errors.coordinates?.longitude ? 'border-red-500' : ''}`}
                    placeholder="-74.0060"
                  />
                  {errors.coordinates?.longitude && (
                    <p className="form-error">{errors.coordinates.longitude.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="form-label">Features</label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {watchedFeatures.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add feature (e.g., Covered, Security Camera)"
                      className="form-input flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addFeature((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement;
                        addFeature(input.value);
                        input.value = '';
                      }}
                      className="btn-outline"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="form-input"
                  placeholder="Optional description or notes about this parking spot"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingSpot ? 'Update Spot' : 'Create Spot'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminSpotsPage;