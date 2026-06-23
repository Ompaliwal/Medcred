/**
 * AdminProfileDrawer.jsx
 * Right-side slide-in drawer (420px) showing the logged-in admin's profile.
 * Sections:
 *   1. Profile Header — gradient banner, avatar with online dot, name/role/email
 *   2. Account Details — 8 info rows with blue/green pill badges and green dot for last login
 *   3. Today's Activity — 3 mini stat boxes (Claims, Verified, Actions)
 *   4. Quick Actions — Change Password, Edit Profile, Notification Settings, View Activity Log
 *   5. Danger Zone — "Logout from All Devices" red outline button
 * Footer: Logout (red outline) + Edit Profile (solid blue) buttons
 * Props: isOpen | onClose | onShowToast(msg, type) | onLogout() — opens logout confirmation modal
 */
import React, { useEffect } from 'react';

const ChevronRight = () => (
  <svg className="w-4 h-4 text-[#D1D5DB] group-hover:text-[#6B7280] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const quickActions = [
  {
    label: 'Change Password',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
  },
  {
    label: 'Edit Profile',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    label: 'Notification Settings',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    label: 'View Activity Log',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
];

const accountDetails = [
  { label: 'Admin ID', value: 'ADM-001' },
  { label: 'Full Name', value: 'Super Admin' },
  { label: 'Email', value: 'admin@medcred.in' },
  { label: 'Mobile', value: '+91 98765 43210' },
  { label: 'Role', value: 'Super Administrator', badge: 'blue' },
  { label: 'Last Login', value: 'Today, 2:21 PM', dot: 'green' },
  { label: 'Account Since', value: 'Jan 1, 2024' },
  { label: 'Status', value: 'Active', badge: 'green' },
];

function renderValue(item) {
  if (item.badge === 'blue') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EEF4FD] text-[#1A73E8]">
        {item.value}
      </span>
    );
  }
  if (item.badge === 'green') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F4EA] text-[#34A853]">
        {item.value}
      </span>
    );
  }
  if (item.dot === 'green') {
    return (
      <span className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#34A853] shrink-0" />
        <span className="text-[14px] font-bold text-[#1C1C1E]">{item.value}</span>
      </span>
    );
  }
  return <span className="text-[14px] font-bold text-[#1C1C1E]">{item.value}</span>;
}

export default function AdminProfileDrawer({ isOpen, onClose, onShowToast, onLogout }) {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* ── Overlay ── */}
      <div
        className="fixed inset-0 z-40 bg-[#00000040]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Drawer panel ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Admin Profile"
        className="fixed inset-y-0 right-0 z-50 flex flex-col bg-white"
        style={{
          width: '420px',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.10)',
          fontFamily: 'Inter, sans-serif',
          animation: 'slideInRight 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* ── Close button ── */}
        <button
          onClick={onClose}
          aria-label="Close drawer"
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors focus:outline-none hover:bg-white/20"
          style={{ color: '#FFFFFF', opacity: 0.85 }}
        >
          <CloseIcon />
        </button>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━
              SECTION 1 — Profile Header
          ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div
            className="flex flex-col items-center justify-center px-6"
            style={{
              height: '180px',
              background: 'linear-gradient(135deg, #1A73E8, #1557B0)',
            }}
          >
            {/* Avatar */}
            <div className="relative">
              <div
                className="flex items-center justify-center rounded-full bg-white"
                style={{
                  width: '72px',
                  height: '72px',
                  border: '3px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                <span style={{ color: '#1A73E8', fontSize: '24px', fontWeight: 700 }}>SA</span>
              </div>
              {/* Online dot */}
              <span
                className="absolute"
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#34A853',
                  border: '2px solid white',
                  bottom: '2px',
                  right: '2px',
                }}
              />
            </div>

            {/* Name */}
            <p style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 700, marginTop: '12px', lineHeight: 1.2 }}>
              Super Admin
            </p>

            {/* Role badge */}
            <span
              style={{
                backgroundColor: 'rgba(255,255,255,0.18)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 500,
                padding: '4px 12px',
                borderRadius: '20px',
                marginTop: '6px',
                display: 'inline-block',
              }}
            >
              Administrator
            </span>

            {/* Email */}
            <p
              style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '13px',
                marginTop: '6px',
                lineHeight: 1.2,
              }}
            >
              admin@medcred.in
            </p>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              SECTION 2 — Account Info
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="px-6 pt-6 pb-2">
            <p
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
              }}
            >
              Account Details
            </p>

            <div>
              {accountDetails.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center"
                  style={{
                    padding: '12px 0',
                    borderBottom: '1px solid #E5E7EB',
                  }}
                >
                  <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>
                    {item.label}
                  </span>
                  {renderValue(item)}
                </div>
              ))}
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              SECTION 3 — Activity Summary
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="px-6 pt-5 pb-2">
            <p
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
              }}
            >
              Today's Activity
            </p>

            <div className="grid grid-cols-3 gap-3">
              {/* Claims Reviewed */}
              <div
                className="text-center"
                style={{
                  backgroundColor: '#F5F7FA',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#1A73E8', lineHeight: 1.2 }}>8</p>
                <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>Claims</p>
              </div>

              {/* Users Verified */}
              <div
                className="text-center"
                style={{
                  backgroundColor: '#F5F7FA',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#34A853', lineHeight: 1.2 }}>5</p>
                <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>Verified</p>
              </div>

              {/* Actions Taken */}
              <div
                className="text-center"
                style={{
                  backgroundColor: '#F5F7FA',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#FBBC04', lineHeight: 1.2 }}>23</p>
                <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>Actions</p>
              </div>
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              SECTION 4 — Quick Actions
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="px-6 pt-5 pb-2">
            <p
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
              }}
            >
              Quick Actions
            </p>

            <div
              style={{
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => onShowToast && onShowToast(`${action.label} clicked`, 'success')}
                  className="group w-full flex items-center gap-3 text-left transition-colors focus:outline-none"
                  style={{
                    height: '48px',
                    padding: '0 16px',
                    backgroundColor: 'transparent',
                    borderBottom: idx < quickActions.length - 1 ? '1px solid #E5E7EB' : 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5F7FA')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span
                    className="shrink-0 transition-colors"
                    style={{ color: '#6B7280' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#1A73E8')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
                  >
                    {action.icon}
                  </span>
                  <span
                    className="flex-1"
                    style={{ fontSize: '13px', fontWeight: 500, color: '#1C1C1E' }}
                  >
                    {action.label}
                  </span>
                  <ChevronRight />
                </button>
              ))}
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              SECTION 5 — Danger Zone
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div
            style={{
              margin: '16px 24px',
              backgroundColor: '#FFF5F5',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              padding: '16px',
            }}
          >
            <p
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#EA4335',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
              }}
            >
              Danger Zone
            </p>
            <button
              onClick={() => onLogout ? onLogout() : onShowToast && onShowToast('Logged out from all devices', 'error')}
              className="w-full transition-colors focus:outline-none"
              style={{
                padding: '10px 0',
                border: '1px solid #EA4335',
                backgroundColor: 'transparent',
                color: '#EA4335',
                fontSize: '14px',
                fontWeight: 700,
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EA4335';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#EA4335';
              }}
            >
              Logout from All Devices
            </button>
          </div>

        </div>{/* end scrollable body */}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            DRAWER FOOTER — sticky bottom
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div
          className="shrink-0 bg-white flex gap-3"
          style={{
            borderTop: '1px solid #E5E7EB',
            padding: '16px 24px',
          }}
        >
          {/* Logout */}
          <button
            onClick={() => {
              onLogout ? onLogout() : onShowToast && onShowToast('Logging out…', 'success');
            }}
            className="transition-colors focus:outline-none"
            style={{
              width: '48%',
              padding: '10px 0',
              border: '1px solid #EA4335',
              backgroundColor: 'transparent',
              color: '#EA4335',
              fontSize: '14px',
              fontWeight: 700,
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#EA4335';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#EA4335';
            }}
          >
            Logout
          </button>

          {/* Edit Profile */}
          <button
            onClick={() => onShowToast && onShowToast('Edit Profile mode enabled', 'success')}
            className="transition-colors focus:outline-none"
            style={{
              width: '48%',
              padding: '10px 0',
              border: 'none',
              backgroundColor: '#1A73E8',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 700,
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(26,115,232,0.3)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#155cb4')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1A73E8')}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Slide-in keyframe */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0.6; }
          to   { transform: translateX(0);    opacity: 1;   }
        }
      `}</style>
    </>
  );
}
