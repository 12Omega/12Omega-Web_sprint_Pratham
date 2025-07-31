/**
 * Sidebar Component
 * Navigation sidebar with menu items
 */

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  User, 
  Settings,
  Shield,
  BarChart3,
  Car
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/app/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Parking Spots',
    href: '/app/spots',
    icon: MapPin,
  },
  {
    name: 'My Bookings',
    href: '/app/bookings',
    icon: Calendar,
  },
  {
    name: 'Earnings',
    href: '/app/earnings',
    icon: BarChart3,
  },
  {
    name: 'Profile',
    href: '/app/profile',
    icon: User,
  },
  {
    name: 'Admin Dashboard',
    href: '/app/admin',
    icon: Shield,
    adminOnly: true,
  },
  {
    name: 'Manage Spots',
    href: '/app/admin/spots',
    icon: Car,
    adminOnly: true,
  },
  {
    name: 'All Bookings',
    href: '/app/admin/bookings',
    icon: Calendar,
    adminOnly: true,
  },
];

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const filteredMenuItems = menuItems.filter(item => 
    !item.adminOnly || user?.role === 'admin'
  );

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center space-x-2 p-6 border-b border-gray-200">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Car className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900">ParkEase</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredMenuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
                }
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-full bg-blue-600 rounded-r"
                  />
                )}
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || 'user@example.com'}
            </p>
            {user?.role === 'admin' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                Admin
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;