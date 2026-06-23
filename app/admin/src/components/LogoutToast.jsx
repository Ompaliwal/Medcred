/**
 * LogoutToast.jsx
 * Fixed top-center toast notification shown after successful logout.
 * Slides in from top (translateY -20px → 0), auto-dismisses after 2.5s,
 * fades + slides up on dismiss. Has a manual close (X) button.
 * Props: visible — triggers the animation sequence | onClose() — called after dismiss
 */
import React, { useState, useEffect } from 'react';

const IconCheckFill = () => (
  <div style={{
    width: 20, height: 20, borderRadius: '50%', background: '#34A853',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }}>
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M1.5 5.5l2.5 2.5 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const IconClose = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/**
 * LogoutToast — slides in from top-center.
 * Props:
 *   visible  boolean
 *   onClose  () => void
 */
export default function LogoutToast({ visible, onClose }) {
  const [phase, setPhase] = useState('hidden'); // hidden | in | shown | out

  useEffect(() => {
    if (visible) {
      setPhase('in');
      // settle after enter animation
      const t1 = setTimeout(() => setPhase('shown'), 320);
      // auto-dismiss after 2.5s
      const t2 = setTimeout(() => setPhase('out'), 2800);
      const t3 = setTimeout(() => { setPhase('hidden'); onClose(); }, 3150);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [visible]);

  const handleClose = () => {
    setPhase('out');
    setTimeout(() => { setPhase('hidden'); onClose(); }, 350);
  };

  if (phase === 'hidden') return null;

  const isOut = phase === 'out';

  return (
    <>
      <style>{`
        @keyframes toastIn  { from{transform:translateX(-50%) translateY(-20px);opacity:0} to{transform:translateX(-50%) translateY(0);opacity:1} }
        @keyframes toastOut { from{transform:translateX(-50%) translateY(0);opacity:1} to{transform:translateX(-50%) translateY(-20px);opacity:0} }
      `}</style>
      <div
        style={{
          position: 'fixed',
          top: 24,
          left: '50%',
          zIndex: 99999,
          transform: 'translateX(-50%)',
          background: '#1C1C1E',
          borderRadius: 10,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.20)',
          minWidth: 300,
          fontFamily: 'Inter, sans-serif',
          animation: isOut
            ? 'toastOut 0.35s ease forwards'
            : 'toastIn 0.3s ease forwards',
        }}
      >
        <IconCheckFill />
        <span style={{ fontSize: 14, color: 'white', fontWeight: 500, flex: 1 }}>
          Logged out successfully
        </span>
        <button
          onClick={handleClose}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0, marginLeft: 'auto', display: 'flex', alignItems: 'center',
          }}
        >
          <IconClose />
        </button>
      </div>
    </>
  );
}
