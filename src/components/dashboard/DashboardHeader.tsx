import React, { useState } from 'react';
import { Bell, Search, User, LogOut, Settings, HelpCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardHeaderProps {
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onLogout }) => {
  const { user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    if (showNotifications) setShowNotifications(false);
  };
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showUserMenu) setShowUserMenu(false);
  };
  
  const handleClickOutside = () => {
    if (showUserMenu) setShowUserMenu(false);
    if (showNotifications) setShowNotifications(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      {/* Left side - Search */}
      <div className="relative w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2"
          placeholder="Search..."
        />
      </div>
      
      {/* Right side - User menu and notifications */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="p-2 rounded-full hover:bg-gray-100 relative"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* Notifications dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Notifications</h3>
                  <button className="text-xs text-blue-600 hover:text-blue-800">Mark all as read</button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                  <div className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bell className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Booking confirmed</p>
                      <p className="text-xs text-gray-500">Your booking #12345 has been confirmed.</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                  <div className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Bell className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Payment successful</p>
                      <p className="text-xs text-gray-500">Your payment of $25.00 was successful.</p>
                      <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 hover:bg-gray-50">
                  <div className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Bell className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Booking reminder</p>
                      <p className="text-xs text-gray-500">Your booking starts in 1 hour.</p>
                      <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 text-center border-t border-gray-200">
                <button className="text-sm text-blue-600 hover:text-blue-800">View all notifications</button>
              </div>
            </div>
          )}
        </div>
        
        {/* User menu */}
        <div className="relative">
          <button
            onClick={toggleUserMenu}
            className="flex items-center space-x-3 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
            </div>
          </button>
          
          {/* User dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <ul>
                <li>
                  <a href="/profile" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg">
                    <User className="w-4 h-4 mr-3 text-gray-500" />
                    Profile
                  </a>
                </li>
                <li>
                  <a href="/settings" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="w-4 h-4 mr-3 text-gray-500" />
                    Settings
                  </a>
                </li>
                <li>
                  <a href="/help" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                    <HelpCircle className="w-4 h-4 mr-3 text-gray-500" />
                    Help & Support
                  </a>
                </li>
                <li className="border-t border-gray-200">
                  <button 
                    onClick={onLogout}
                    className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left rounded-b-lg"
                  >
                    <LogOut className="w-4 h-4 mr-3 text-red-500" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Overlay to close dropdowns when clicking outside */}
      {(showUserMenu || showNotifications) && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={handleClickOutside}
        ></div>
      )}
    </header>
  );
};

export default DashboardHeader;