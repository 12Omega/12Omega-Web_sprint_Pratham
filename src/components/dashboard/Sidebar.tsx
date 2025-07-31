import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Map, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Car,
  CreditCard,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: Home, 
      path: '/dashboard',
      active: isActive('/dashboard')
    },
    { 
      name: 'Bookings', 
      icon: Calendar, 
      path: '/bookings',
      active: isActive('/bookings')
    },
    { 
      name: 'Parking Spots', 
      icon: Map, 
      path: '/spots',
      active: isActive('/spots')
    },
    { 
      name: 'Vehicles', 
      icon: Car, 
      path: '/vehicles',
      active: isActive('/vehicles')
    },
    { 
      name: 'Payments', 
      icon: CreditCard, 
      path: '/payments',
      active: isActive('/payments')
    },
    { 
      name: 'Reports', 
      icon: BarChart3, 
      path: '/reports',
      active: isActive('/reports')
    }
  ];
  
  const adminItems = [
    { 
      name: 'User Management', 
      icon: Users, 
      path: '/admin/users',
      active: isActive('/admin/users')
    }
  ];
  
  const bottomItems = [
    { 
      name: 'Settings', 
      icon: Settings, 
      path: '/settings',
      active: isActive('/settings')
    },
    { 
      name: 'Help & Support', 
      icon: HelpCircle, 
      path: '/help',
      active: isActive('/help')
    }
  ];

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-10 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-gray-200`}>
          {!collapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">ParkEase</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
          )}
          <button 
            onClick={onToggle}
            className={`${collapsed ? 'absolute -right-3 top-12' : ''} p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors`}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        
        {/* Main Menu */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-3">
            {!collapsed && <p className="text-xs font-medium text-gray-400 mb-2 ml-2">MAIN MENU</p>}
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center ${
                      collapsed ? 'justify-center' : ''
                    } px-3 py-2 rounded-lg transition-colors ${
                      item.active
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className={`${collapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'}`} />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Admin Menu */}
          <div className="px-3 mt-6">
            {!collapsed && <p className="text-xs font-medium text-gray-400 mb-2 ml-2">ADMIN</p>}
            <ul className="space-y-1">
              {adminItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center ${
                      collapsed ? 'justify-center' : ''
                    } px-3 py-2 rounded-lg transition-colors ${
                      item.active
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className={`${collapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'}`} />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Menu */}
        <div className="border-t border-gray-200 py-4 px-3">
          <ul className="space-y-1">
            {bottomItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center ${
                    collapsed ? 'justify-center' : ''
                  } px-3 py-2 rounded-lg transition-colors ${
                    item.active
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`${collapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'}`} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
            <li>
              <button
                className={`flex items-center ${
                  collapsed ? 'justify-center w-full' : ''
                } px-3 py-2 rounded-lg transition-colors text-red-600 hover:bg-red-50`}
              >
                <LogOut className={`${collapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'}`} />
                {!collapsed && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;