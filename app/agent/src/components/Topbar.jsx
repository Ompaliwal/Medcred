import React, { useState } from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Topbar = ({ title = 'Dashboard', onMenuClick, onLogout, hasUnread = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-[var(--color-white)] h-16 border-b border-[var(--color-border)] flex items-center justify-between px-4 sm:px-6 relative z-30">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="mr-4 text-[var(--color-subtext)] hover:text-[var(--color-text)] md:hidden focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-[var(--color-text)]">{title}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/notifications" className="text-[var(--color-subtext)] hover:text-[var(--color-text)] focus:outline-none relative transition-colors">
          <Bell className="h-6 w-6" />
          {hasUnread && (
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-[var(--color-danger)] ring-2 ring-white"></span>
          )}
        </Link>
        <div className="relative flex items-center space-x-2">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-8 w-8 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors flex items-center justify-center text-[var(--color-primary)] font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
          >
            VS
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-[var(--color-border)] z-50">
              <Link 
                to="/profile" 
                className="flex items-center px-4 py-2 text-sm text-[var(--color-text)] hover:bg-gray-50 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <User className="h-4 w-4 mr-2 text-[var(--color-subtext)]" />
                Profile
              </Link>
              <div className="border-t border-[var(--color-border)] my-1"></div>
              <button 
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                onClick={() => {
                  setIsDropdownOpen(false);
                  if (onLogout) onLogout();
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
