/**
 * Sidebar.jsx
 * Left desktop sidebar (240px, white, sticky).
 * Top: MedCred India brand logo + "Live" indicator.
 * Middle: Grouped navigation (MAIN / OPERATIONS / FINANCE / SYSTEM)
 *         with active highlight, hover states, and KYC pending badge.
 * Bottom: Clickable admin profile card that opens AdminProfileDrawer.
 * Props: activeTab | setActiveTab | pendingVerificationsCount | onShowToast | onOpenProfile() | onLogout()
 * Exports: SIDEBAR_GROUPS array (used by App.jsx for mobile sidebar and default page label).
 */
import React from 'react';
import Icon from './Icons';

export const SIDEBAR_GROUPS = [
  {
    label: 'MAIN',
    items: [
      { id: 'dashboard', name: 'Dashboard', icon: 'grid' },
      { id: 'users', name: 'Users', icon: 'person' },
      { id: 'health-cards', name: 'Health Cards', icon: 'card' },
    ]
  },
  {
    label: 'OPERATIONS',
    items: [
      { id: 'claims', name: 'Claims', icon: 'file' },
      { id: 'verifications', name: 'KYC Verification', icon: 'shield' },
      { id: 'loans', name: 'Loan Monitoring', icon: 'rupee' },
      { id: 'agents', name: 'Agents', icon: 'briefcase' },
      { id: 'hospitals', name: 'Hospitals', icon: 'building' },
    ]
  },
  {
    label: 'FINANCE',
    items: [
      { id: 'wallet', name: 'Wallet & Txns', icon: 'wallet' },
    ]
  },
  {
    label: 'SYSTEM',
    items: [

      { id: 'reports', name: 'Reports', icon: 'chart' },
      { id: 'settings', name: 'Settings', icon: 'settings' },
    ]
  }
];

export default function Sidebar({ activeTab, setActiveTab, pendingVerificationsCount, onShowToast, onOpenProfile, onLogout }) {
  const handleTabClick = (itemId, itemName) => {
    setActiveTab(itemId, itemName);
  };

  return (
    <aside className="hidden lg:flex flex-col w-[240px] bg-white border-r border-[#E5E7EB] shrink-0 sticky top-0 h-screen font-sans">
      {/* Brand Card - TOP SECTION — h-16 matches the main Header height */}
      <div className="w-full h-16 px-4 bg-white border-b border-[#E5E7EB] shrink-0 flex items-center overflow-hidden" style={{ whiteSpace: 'nowrap' }}>
        {/* Logo */}
        <div className="flex items-center justify-center rounded-[8px] bg-[#1A73E8] text-white font-bold shrink-0" style={{ width: 36, height: 36, fontSize: 18, marginRight: 10 }}>
          M
        </div>
        {/* Text */}
        <span className="font-bold text-[#1C1C1E] shrink-0" style={{ fontSize: 14, marginRight: 8, whiteSpace: 'nowrap' }}>
          MedCred
        </span>
        {/* Live indicator */}
        <div className="flex items-center shrink-0" style={{ gap: 4 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34A853', display: 'inline-block' }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: '#34A853' }}>Live</span>
        </div>
      </div>

      {/* Navigation Links - MIDDLE SECTION */}
      <nav className="flex-1 overflow-y-auto py-2">
        {SIDEBAR_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx} className="mb-2">
            {/* Group Label */}
            <div className="px-4 pt-4 pb-1">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-[1px]">
                {group.label}
              </span>
            </div>
            {/* Group Items */}
            <div className="px-2 space-y-0.5">
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id, item.name)}
                    className={`w-full flex items-center h-[44px] px-4 rounded-lg transition-colors group focus:outline-none ${isActive
                      ? 'bg-[#1A73E8] text-white'
                      : 'text-[#1C1C1E] font-medium hover:bg-[#F0F7FF] hover:text-[#1A73E8]'
                      }`}
                  >
                    <Icon
                      name={item.icon}
                      className={`shrink-0 w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-[#6B7280] group-hover:text-[#1A73E8]'
                        }`}
                    />
                    <span className={`ml-3 text-[14px] ${isActive ? 'font-medium' : 'font-medium'}`}>
                      {item.name}
                    </span>
                    {item.id === 'verifications' && pendingVerificationsCount > 0 && (
                      <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-[#1A73E8]' : 'bg-[#EA4335] text-white'
                        }`}>
                        {pendingVerificationsCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Admin Profile Card - BOTTOM SECTION */}
      <div className="sticky bottom-0 w-full p-3 bg-white border-t border-[#E5E7EB]">
        <button
          onClick={onOpenProfile}
          className="w-full flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-[#F0F7FF] transition-colors focus:outline-none group"
          title="View profile"
        >
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-[#1A73E8] flex items-center justify-center shrink-0">
            <span className="text-white text-[14px] font-bold">SA</span>
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
            <span className="text-[13px] font-bold text-[#1C1C1E] truncate leading-tight group-hover:text-[#1A73E8] transition-colors">Super Admin</span>
            <span className="text-[11px] text-[#6B7280] truncate leading-tight mt-0.5">admin@medcred.in</span>
          </div>
          {/* Chevron hint */}
          <svg className="w-4 h-4 text-[#D1D5DB] group-hover:text-[#1A73E8] transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
