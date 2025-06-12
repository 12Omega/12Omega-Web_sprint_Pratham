import React from 'react';
import { Car, BarChart3, MapPin, Calendar, DollarSign, Users, Settings, Menu } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', active: true },
    { icon: MapPin, label: 'Parking Slots' },
    { icon: Calendar, label: 'Bookings', badge: '3' },
    { icon: DollarSign, label: 'Earnings' },
    { icon: Users, label: 'Customers' },
    { icon: Settings, label: 'Settings' }
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-40 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
            <Car className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <span className="ml-3 text-xl font-bold">SmartPark</span>
          )}
        </div>
        <button
          onClick={onToggle}
          className="text-white hover:bg-slate-700 p-2 rounded-lg transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-4 border-b border-slate-700 flex items-center">
        <img
          src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
          alt="User"
          className="w-10 h-10 rounded-full border-2 border-blue-400"
        />
        {!collapsed && (
          <div className="ml-3 flex-1 min-w-0">
            <div className="font-medium truncate">John Doe</div>
            <div className="text-xs text-slate-400 truncate">Parking Owner</div>
          </div>
        )}
      </div>
      
      <nav className="mt-4 flex-1">
        <div className="space-y-1 px-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center py-3 px-4 rounded-xl transition-all duration-200 group ${
                item.active
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="ml-3 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </a>
          ))}
        </div>
        
        {!collapsed && (
          <div className="mt-auto p-4 border-t border-slate-700">
            <div className="flex items-center justify-between text-slate-400 text-sm">
              <span>System Status</span>
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Last updated: Just now
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;