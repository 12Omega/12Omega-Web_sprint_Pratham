import React, { useState } from 'react';
import { Bell, LogOut, Calendar } from 'lucide-react';

interface DashboardHeaderProps {
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const notifications = [
    {
      id: 1,
      type: 'booking',
      title: 'New booking received',
      message: 'Slot #12 booked for 2 hours',
      time: '2 minutes ago',
      icon: '🚗'
    },
    {
      id: 2,
      type: 'maintenance',
      title: 'Maintenance alert',
      message: 'Slot #3 requires maintenance',
      time: '1 hour ago',
      icon: '⚠️'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment received',
      message: '$24.50 from booking #4567',
      time: '3 hours ago',
      icon: '💰'
    }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <div className="ml-6 text-sm text-gray-500 hidden md:flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{currentDate}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-gray-600 hover:text-gray-900 focus:outline-none p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl z-50 border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-start">
                        <div className="text-2xl mr-3">{notification.icon}</div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={onLogout}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none flex items-center transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;