/**
 * Profile Page Component
 * User profile management and settings
 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Edit3, 
  Save, 
  X,
  Shield,
  Calendar,
  Car,
  CreditCard
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { RootState, AppDispatch } from '../store/store';
import { updateProfile } from '../store/slices/authSlice';
import { useAuth } from '../contexts/AuthContext';

interface ProfileFormData {
  name: string;
  phone?: string;
}

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { loading } = useSelector((state: RootState) => state.auth);
  const { bookings } = useSelector((state: RootState) => state.bookings);
  
  // Add mock user data if user is undefined
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    role: 'user',
    createdAt: '2024-01-15T10:30:00.000Z',
    address: '123 Main Street, New York, NY 10001',
    preferredVehicles: [
      { make: 'Toyota', model: 'Camry', year: 2022, licensePlate: 'ABC-1234' },
      { make: 'Honda', model: 'Civic', year: 2020, licensePlate: 'XYZ-5678' }
    ],
    paymentMethods: [
      { type: 'Credit Card', last4: '4242', expiry: '05/25', isDefault: true },
      { type: 'PayPal', email: 'john.doe@example.com', isDefault: false }
    ],
    preferences: {
      notifications: true,
      emailAlerts: true,
      smsAlerts: false,
      autoRenew: true,
      preferredSpotTypes: ['standard', 'compact']
    }
  };
  
  const userData = user || mockUser;
  
  const [isEditing, setIsEditing] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: userData.name || '',
      phone: userData.phone || ''
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const result = await dispatch(updateProfile(data));
      if (updateProfile.fulfilled.match(result)) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    reset({
      name: user?.name || '',
      phone: user?.phone || ''
    });
    setIsEditing(false);
  };

  // Add defensive checks for bookings array
  const bookingsArray = Array.isArray(bookings) ? bookings : [];
  
  const totalBookings = bookingsArray.length;
  const activeBookings = bookingsArray.filter(b => b?.status === 'active').length;
  const completedBookings = bookingsArray.filter(b => b?.status === 'completed').length;
  const totalSpent = bookingsArray
    .filter(b => b?.paymentStatus === 'paid')
    .reduce((sum, b) => sum + (b?.totalCost || 0), 0);

  const stats = [
    {
      title: 'Total Bookings',
      value: totalBookings,
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Bookings',
      value: activeBookings,
      icon: Car,
      color: 'bg-green-500'
    },
    {
      title: 'Completed',
      value: completedBookings,
      icon: Shield,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Spent',
      value: `$${totalSpent.toFixed(2)}`,
      icon: CreditCard,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-outline flex items-center"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCancel}
                    className="btn-secondary flex items-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            {!isEditing ? (
              <div className="space-y-6">
                {/* Profile Avatar */}
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{userData.name}</h3>
                    <p className="text-gray-600">{userData.email}</p>
                    {userData.role === 'admin' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                        Administrator
                      </span>
                    )}
                  </div>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{userData.name || 'Not provided'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{userData.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{userData.phone || 'Not provided'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Member Since
                    </label>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">
                        {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Vehicles */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Registered Vehicles</h3>
                  <div className="space-y-4">
                    {userData.preferredVehicles?.map((vehicle, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{vehicle.make} {vehicle.model} ({vehicle.year})</h4>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {vehicle.licensePlate}
                          </span>
                        </div>
                      </div>
                    ))}
                    <button className="w-full p-3 border border-dashed border-gray-300 rounded-lg text-center text-sm text-blue-600 hover:bg-blue-50 transition-colors">
                      + Add New Vehicle
                    </button>
                  </div>
                </div>
                
                {/* Payment Methods */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
                  <div className="space-y-4">
                    {userData.paymentMethods?.map((payment, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{payment.type}</h4>
                            {payment.type === 'Credit Card' ? (
                              <p className="text-sm text-gray-600">•••• {payment.last4} | Expires {payment.expiry}</p>
                            ) : (
                              <p className="text-sm text-gray-600">{payment.email}</p>
                            )}
                          </div>
                          {payment.isDefault && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    <button className="w-full p-3 border border-dashed border-gray-300 rounded-lg text-center text-sm text-blue-600 hover:bg-blue-50 transition-colors">
                      + Add Payment Method
                    </button>
                  </div>
                </div>
                
                {/* Preferences */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Email Notifications</span>
                      <div className={`w-10 h-6 ${userData.preferences?.emailAlerts ? 'bg-green-500' : 'bg-gray-300'} rounded-full relative`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${userData.preferences?.emailAlerts ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">SMS Alerts</span>
                      <div className={`w-10 h-6 ${userData.preferences?.smsAlerts ? 'bg-green-500' : 'bg-gray-300'} rounded-full relative`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${userData.preferences?.smsAlerts ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Auto-Renew Bookings</span>
                      <div className={`w-10 h-6 ${userData.preferences?.autoRenew ? 'bg-green-500' : 'bg-gray-300'} rounded-full relative`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${userData.preferences?.autoRenew ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Profile Avatar */}
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{userData.name}</h3>
                    <p className="text-gray-600">{userData.email}</p>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        {...register('name', {
                          required: 'Name is required',
                          minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters'
                          }
                        })}
                        type="text"
                        className={`form-input pl-10 ${errors.name ? 'border-red-500' : ''}`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="form-error">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        {...register('phone', {
                          pattern: {
                            value: /^\+?[\d\s-()]+$/,
                            message: 'Invalid phone number format'
                          }
                        })}
                        type="tel"
                        className={`form-input pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {errors.phone && (
                      <p className="form-error">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
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
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Account Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
            <div className="space-y-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.title} className="flex items-center space-x-3">
                    <div className={`${stat.color} p-2 rounded-lg`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">Email Verified</span>
                </div>
                <span className="text-xs text-green-600 font-medium">✓</span>
              </div>
              
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Change Password</span>
                  <span className="text-gray-400">→</span>
                </div>
              </button>
              
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Two-Factor Authentication</span>
                  <span className="text-gray-400">→</span>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => window.location.href = '/app/spots'}
                className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <span className="text-sm text-blue-700">Find Parking Spots</span>
              </button>
              <button
                onClick={() => window.location.href = '/app/bookings'}
                className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <span className="text-sm text-green-700">View My Bookings</span>
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={() => window.location.href = '/app/admin'}
                  className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <span className="text-sm text-purple-700">Admin Dashboard</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;