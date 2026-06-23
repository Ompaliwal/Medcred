/**
 * Header.jsx
 * Sticky top header bar (h-16, white).
 * Left: hamburger menu (mobile) + "Admin Panel" title.
 * Center: global search bar (hidden on mobile).
 * Right: notification bell with unread dot + dropdown list, admin avatar pill.
 * Props: searchQuery | setSearchQuery | setMobileMenuOpen | notifications | setNotifications | onShowToast
 */
import React, { useState } from 'react';
import Icon from './Icons';

export default function Header({
  searchQuery,
  setSearchQuery,
  setMobileMenuOpen,
  notifications,
  setNotifications,
  onShowToast,
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="h-16 bg-white border-b border-[#E5E4E7] flex items-center justify-between px-4 sm:px-6 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-3 lg:gap-0">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-1.5 rounded-lg text-[#6B7280] hover:text-[#1C1C1E] hover:bg-[#F3F4F6] transition-colors focus:outline-none"
        >
          <Icon name="menu" />
        </button>
        <h1 className="font-display font-bold text-lg md:text-xl text-[#1C1C1E] m-0 self-center">
          Admin Panel
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Global Search Bar */}
        <div className="relative hidden sm:block w-64 md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280]">
            <Icon name="search" />
          </span>
          <input
            type="text"
            placeholder="Search claims, name, type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 text-sm bg-[#F3F4F6] border-0 rounded-lg text-[#1C1C1E] placeholder-[#6B7280] focus:ring-2 focus:ring-[#1A73E8]/20 focus:bg-white focus:outline-none transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-[#6B7280] hover:text-[#1C1C1E] focus:outline-none"
            >
              Clear
            </button>
          )}
        </div>

        {/* Notification Center */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[#6B7280] hover:text-[#1C1C1E] rounded-full hover:bg-[#F3F4F6] transition-all focus:outline-none"
          >
            <Icon name="bell" />
            {notifications.some((n) => !n.read) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EA4335] rounded-full border border-white" />
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2.5 w-80 bg-white rounded-xl shadow-xl border border-[#E5E4E7] py-2 z-50 animate-slide-in">
                <div className="px-4 py-2 border-b border-[#E5E4E7] flex justify-between items-center">
                  <span className="font-display font-semibold text-xs text-[#1C1C1E]">Notifications</span>
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-[#1A73E8] hover:underline font-medium focus:outline-none"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-[#6B7280]">No notifications.</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F8F9FA] transition-colors ${!notif.read ? 'bg-[#1A73E8]/5' : ''
                          }`}
                      >
                        <p className="text-xs text-[#1C1C1E] leading-relaxed font-medium">{notif.text}</p>
                        <span className="text-[9px] text-[#6B7280] block mt-1">{notif.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Profile Menu */}
        <div className="flex items-center gap-2 border-l border-[#E5E4E7] pl-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1A73E8] to-[#155cb4] text-white font-semibold text-xs flex items-center justify-center shadow">
            AD
          </div>
          <span className="hidden md:inline text-xs font-semibold text-[#1C1C1E]">Admin</span>
        </div>
      </div>
    </header>
  );
}
