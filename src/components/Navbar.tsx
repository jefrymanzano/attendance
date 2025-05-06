import React from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
  userName: string;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, userName, onLogout }) => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 focus:outline-none md:hidden"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 ml-4">Attendance Tracking System</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
            <Bell size={20} />
          </button>
          
          <div className="relative">
            <span className="text-sm font-medium text-gray-700">{userName}</span>
          </div>
          
          <button 
            onClick={onLogout}
            className="flex items-center text-gray-600 hover:text-red-600 focus:outline-none transition-colors duration-200"
          >
            <LogOut size={20} />
            <span className="ml-1 text-sm hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;