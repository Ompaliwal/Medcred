/**
 * LogoutModal.jsx
 * Full-screen overlay confirmation modal triggered before logout.
 * Shows: red logout icon circle, "Sign Out?" heading, subtext,
 * Cancel button and "Yes, Logout" button with loading spinner.
 * Closes on Escape key or overlay click (unless loading).
 * Props: isOpen | onCancel() | onConfirm() — called after 1.2s simulated async logout
 */
import React, { useState, useEffect } from 'react';

const Spinner = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    style={{ animation: 'mcSpin 0.7s linear infinite', display: 'block' }}>
    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
    <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const IconLogout = () => (
  <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#EA4335" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default function LogoutModal({ isOpen, onCancel, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const [hovCancel, setHovCancel] = useState(false);
  const [hovConfirm, setHovConfirm] = useState(false);

  // Reset loading when modal closes
  useEffect(() => {
    if (!isOpen) setLoading(false);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handle = (e) => { if (e.key === 'Escape' && isOpen && !loading) onCancel(); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (loading) return;
    setLoading(true);
    // simulate async logout
    setTimeout(() => {
      setLoading(false);
      onConfirm();
    }, 1200);
  };

  return (
    <>
      <style>{`@keyframes mcSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>

      {/* Overlay */}
      <div
        onClick={!loading ? onCancel : undefined}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'mcFadeIn 0.2s ease',
        }}
      >
        {/* Modal box */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: 360, background: 'white', borderRadius: 16, padding: 32,
            boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
            textAlign: 'center',
            animation: 'mcScaleUp 0.22s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {/* Icon circle */}
          <div style={{
            width: 64, height: 64, background: '#FFF5F5', borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconLogout />
          </div>

          <p style={{ fontSize: 20, fontWeight: 700, color: '#1C1C1E', margin: '0 0 8px', fontFamily: 'Inter,sans-serif' }}>
            Sign Out?
          </p>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.5, margin: '0 0 28px', fontFamily: 'Inter,sans-serif' }}>
            You will be signed out of MedCred India Admin Panel.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            {/* Cancel */}
            <button
              onClick={!loading ? onCancel : undefined}
              disabled={loading}
              onMouseEnter={() => setHovCancel(true)}
              onMouseLeave={() => setHovCancel(false)}
              style={{
                width: '48%', height: 42,
                background: hovCancel && !loading ? '#F5F7FA' : 'white',
                border: '1px solid #E5E7EB', color: '#1C1C1E',
                borderRadius: 6, fontSize: 14, fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                transition: 'background 0.15s',
                fontFamily: 'Inter,sans-serif',
              }}
            >
              Cancel
            </button>

            {/* Confirm */}
            <button
              onClick={handleConfirm}
              disabled={loading}
              onMouseEnter={() => setHovConfirm(true)}
              onMouseLeave={() => setHovConfirm(false)}
              style={{
                width: '48%', height: 42,
                background: hovConfirm && !loading ? '#C62828' : '#EA4335',
                border: 'none', color: 'white',
                borderRadius: 6, fontSize: 14, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
                fontFamily: 'Inter,sans-serif',
              }}
            >
              {loading ? <Spinner size={18} /> : 'Yes, Logout'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes mcFadeIn  { from{opacity:0}           to{opacity:1} }
        @keyframes mcScaleUp { from{transform:scale(0.92);opacity:0} to{transform:scale(1);opacity:1} }
      `}</style>
    </>
  );
}
