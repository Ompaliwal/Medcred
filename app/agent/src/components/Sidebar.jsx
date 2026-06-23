import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserPlus, Users, FileText, Wallet, Award, Bell, User, Settings, ChevronDown, ChevronRight } from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const [isUsersOpen, setIsUsersOpen] = useState(false);

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    // Users section handled manually below
    { name: 'Applications', path: '/applications', icon: FileText },
    { name: 'Wallet', path: '/wallet', icon: Wallet },
    { name: 'Incentives', path: '/incentives', icon: Award },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[var(--color-white)] border-r border-[var(--color-border)] h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-[var(--color-border)]">
        <span className="text-xl font-bold text-[var(--color-primary)]">MedCred Agent</span>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {/* Dashboard */}
        <NavLink
          to="/"
          onClick={handleLinkClick}
          className={({ isActive }) =>
            `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive ? 'bg-blue-50 text-[var(--color-primary)]' : 'text-[var(--color-text)] hover:bg-gray-50'
            }`
          }
        >
          <LayoutDashboard className="mr-3 h-5 w-5 opacity-75" />
          Dashboard
        </NavLink>

        {/* Users Collapsible Menu */}
        <div className="py-1">
          <button
            onClick={() => setIsUsersOpen(!isUsersOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors text-[var(--color-text)] hover:bg-gray-50 focus:outline-none"
          >
            <div className="flex items-center">
              <Users className="mr-3 h-5 w-5 opacity-75" />
              Users
            </div>
            {/* The arrow is intentionally removed as requested */}
          </button>
          
          {isUsersOpen && (
            <div className="mt-1 space-y-1">
              <NavLink
                to="/users/register"
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `flex items-center pl-11 pr-3 py-2 text-sm font-medium transition-colors border-l-2 ${
                    isActive ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-blue-50' : 'border-transparent text-[var(--color-subtext)] hover:text-[var(--color-text)] hover:bg-gray-50'
                  }`
                }
              >
                Register User
              </NavLink>
              <NavLink
                to="/users"
                end
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `flex items-center pl-11 pr-3 py-2 text-sm font-medium transition-colors border-l-2 ${
                    isActive ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-blue-50' : 'border-transparent text-[var(--color-subtext)] hover:text-[var(--color-text)] hover:bg-gray-50'
                  }`
                }
              >
                Registered Users
              </NavLink>
            </div>
          )}
        </div>

        {/* Rest of the items */}
        {navItems.slice(1).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive ? 'bg-blue-50 text-[var(--color-primary)]' : 'text-[var(--color-text)] hover:bg-gray-50'
                }`
              }
            >
              <Icon className="mr-3 h-5 w-5 opacity-75" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;


