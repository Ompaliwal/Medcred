import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { dummyNotifications } from '../data/dummyData';

const getPageTitle = (pathname) => {
  if (pathname === '/') return 'Dashboard';
  if (pathname.includes('/users/register')) return 'Register User';
  if (pathname.includes('/edit')) return 'Edit User';
  if (pathname === '/users') return 'Registered Users';
  if (pathname.startsWith('/users/')) return 'User Details';
  if (pathname === '/applications') return 'Applications Tracking';
  if (pathname === '/wallet') return 'My Wallet';
  if (pathname === '/incentives') return 'Incentive History';
  if (pathname === '/notifications') return 'Notifications';
  if (pathname === '/profile') return 'Agent Profile';
  if (pathname === '/settings') return 'Settings';
  return 'Dashboard';
};

const DashboardLayout = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(dummyNotifications);
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  const hasUnread = notifications.some(n => !n.read);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background)]">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} onLogout={onLogout} hasUnread={hasUnread} />
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 sm:p-6">
          <Outlet context={{ notifications, setNotifications, onLogout }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
