import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, UserPlus, Settings, Calendar, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { isAdmin } = useUser();

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} flex flex-col shadow-lg`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 className={`font-bold text-xl transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
          AttendEase
        </h2>
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-gray-800 focus:outline-none"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => 
                `flex items-center py-3 px-4 ${isActive ? 'bg-gray-800 text-white' : 'text-gray-100 hover:bg-gray-800 hover:text-white'} transition-colors`
              }
            >
              <Home size={20} />
              <span className={`ml-3 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Dashboard</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/attendance"
              className={({ isActive }) => 
                `flex items-center py-3 px-4 ${isActive ? 'bg-gray-800 text-white' : 'text-gray-100 hover:bg-gray-800 hover:text-white'} transition-colors`
              }
            >
              <Calendar size={20} />
              <span className={`ml-3 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Attendance</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/reports"
              className={({ isActive }) => 
                `flex items-center py-3 px-4 ${isActive ? 'bg-gray-800 text-white' : 'text-gray-100 hover:bg-gray-800 hover:text-white'} transition-colors`
              }
            >
              <BarChart3 size={20} />
              <span className={`ml-3 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Announcements</span>
            </NavLink>
          </li>
          
          {isAdmin() && (
            <li>
              <NavLink
                to="/register"
                className={({ isActive }) => 
                  `flex items-center py-3 px-4 ${isActive ? 'bg-gray-800 text-white' : 'text-gray-100 hover:bg-gray-800 hover:text-white'} transition-colors`
                }
              >
                <UserPlus size={20} />
                <span className={`ml-3 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Register User</span>
              </NavLink>
            </li>
          )}
          
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) => 
                `flex items-center py-3 px-4 ${isActive ? 'bg-gray-800 text-white' : 'text-gray-100 hover:bg-gray-800 hover:text-white'} transition-colors`
              }
            >
              <Settings size={20} />
              <span className={`ml-3 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Profile</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;