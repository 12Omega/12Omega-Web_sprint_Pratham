import React, { useState, useEffect } from 'react';
import { Users, Package, TrendingUp, DollarSign, Activity, AlertTriangle } from 'lucide-react';
import axios from 'axios';

interface Stats {
  users: {
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
    recentUsers: number;
  };
  products: {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    featuredProducts: number;
    categories: number;
    inventoryValue: number;
  };
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [userStats, productStats] = await Promise.all([
        axios.get('http://localhost:5000/api/users/stats/overview'),
        axios.get('http://localhost:5000/api/products/stats/overview')
      ]);

      setStats({
        users: userStats.data,
        products: productStats.data
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users.totalUsers || 0,
      icon: Users,
      color: 'blue',
      change: '+' + (stats?.users.recentUsers || 0) + ' this month'
    },
    {
      title: 'Total Products',
      value: stats?.products.totalProducts || 0,
      icon: Package,
      color: 'green',
      change: (stats?.products.categories || 0) + ' categories'
    },
    {
      title: 'Inventory Value',
      value: '$' + (stats?.products.inventoryValue || 0).toLocaleString(),
      icon: DollarSign,
      color: 'purple',
      change: 'Total stock value'
    },
    {
      title: 'Low Stock Items',
      value: stats?.products.lowStockProducts || 0,
      icon: AlertTriangle,
      color: 'orange',
      change: 'Requires attention'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-500 text-blue-700',
    green: 'bg-emerald-500 text-emerald-700',
    purple: 'bg-purple-500 text-purple-700',
    orange: 'bg-amber-500 text-amber-700'
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${colorClasses[stat.color as keyof typeof colorClasses].split(' ')[0]} bg-opacity-10`}>
                  <Icon className={`w-6 h-6 ${colorClasses[stat.color as keyof typeof colorClasses].split(' ')[1]}`} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Overview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Users</span>
              <span className="font-semibold text-green-600">{stats?.users.activeUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Admin Users</span>
              <span className="font-semibold text-blue-600">{stats?.users.adminUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New This Month</span>
              <span className="font-semibold text-purple-600">{stats?.users.recentUsers}</span>
            </div>
          </div>
        </div>

        {/* Product Overview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Products</span>
              <span className="font-semibold text-green-600">{stats?.products.activeProducts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Featured Products</span>
              <span className="font-semibold text-blue-600">{stats?.products.featuredProducts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Categories</span>
              <span className="font-semibold text-purple-600">{stats?.products.categories}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-center">
            <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Add New User</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-center">
            <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Add New Product</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-center">
            <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">View Analytics</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;