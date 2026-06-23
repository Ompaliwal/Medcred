/**
 * Login.jsx — /admin-login
 * Full-screen centered login page for MedCred India Admin Panel.
 * Single login form with email + password, show/hide password,
 * remember me checkbox, logout success banner, error banner,
 * disabled/loading sign-in button.
 * Hardcoded credentials: admin@medcred.in / admin123
 * Props: onLogin() — called on successful sign-in
 *        showLogoutBanner — shows green "logged out" banner on mount
 */
import React, { useState, useEffect } from 'react';

/* ─── Icons ─── */
const IconMail = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#6B7280" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const IconLock = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#6B7280" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const IconEyeOff = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);
const IconEyeOn = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const IconCheckCircle = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#34A853" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconWarning = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#EA4335" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);
const IconLockSm = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#6B7280" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

/* ─── Spinner ─── */
const Spinner = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    style={{ animation: 'mcSpin 0.7s linear infinite', display: 'block' }}>
    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/* ─── Input field ─── */
function Field({ label, type, placeholder, value, onChange, rightSlot }) {
  const [focused, setFocused] = useState(false);
  const isPassword = label === 'Password';
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, color: '#6B7280', marginBottom: 6, fontWeight: 500 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
          {isPassword ? <IconLock /> : <IconMail />}
        </span>
        <input
          type={type} placeholder={placeholder} value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', height: 44,
            border: `1px solid ${focused ? '#1A73E8' : '#E5E7EB'}`,
            borderRadius: 6,
            padding: `0 ${rightSlot ? 40 : 12}px 0 40px`,
            fontSize: 14, color: '#1C1C1E', background: 'white', outline: 'none',
            boxShadow: focused ? '0 0 0 3px rgba(26,115,232,0.10)' : 'none',
            transition: 'border 0.15s, box-shadow 0.15s',
            fontFamily: 'Inter, sans-serif',
            boxSizing: 'border-box',
          }}
        />
        {rightSlot && (
          <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#6B7280' }}>
            {rightSlot}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Main Login export ─── */
export default function Login({ onLogin, showLogoutBanner = false }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [banner, setBanner] = useState(showLogoutBanner);
  const [btnHov, setBtnHov] = useState(false);

  // Auto-hide logout banner after 3s
  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(false), 3000);
    return () => clearTimeout(t);
  }, [banner]);

  const empty = !email.trim() || !password.trim();

  const doSignIn = () => {
    if (empty || loading) return;
    setError(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email === 'admin@medcred.in' && password === 'admin123') {
        onLogin();
      } else {
        setError(true);
      }
    }, 1500);
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') doSignIn(); };

  return (
    <>
      <style>{`
        @keyframes mcSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: #9CA3AF; }
      `}</style>

      <div style={{
        width: '100vw', height: '100vh', background: '#F5F7FA', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        {/* Card */}
        <div style={{
          width: 420, background: 'white', borderRadius: 16, padding: 40,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB',
          boxSizing: 'border-box',
        }}>
          {/* Mini brand row */}
          <div className='items-center justify-center' style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
            <div style={{ width: 32, height: 32, background: '#1A73E8', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'white', fontSize: 16, fontWeight: 700 }}>M</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1C1C1E', marginLeft: 8 }}>MedCred</span>
            <span style={{ background: '#EEF4FD', color: '#1A73E8', fontSize: 11, padding: '3px 10px', borderRadius: 20, marginLeft: 8 }}>
              Admin
            </span>
          </div>
          {/* Heading */}
          <p style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, color: '#1C1C1E', margin: '0 0 6px' }}>Welcome back! </p>
          <p style={{ textAlign: 'center', fontSize: 14, color: '#6B7280', margin: '0 0 28px' }}>Sign in to your admin account</p>

          {/* Logout success banner */}
          {banner && (
            <div style={{ background: '#E6F4EA', border: '1px solid #34A853', borderRadius: 6, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconCheckCircle />
              <span style={{ fontSize: 13, color: '#34A853' }}>You have been logged out successfully.</span>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div style={{ background: '#FFF5F5', border: '1px solid #FECACA', borderRadius: 6, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconWarning />
              <span style={{ fontSize: 13, color: '#EA4335' }}>Invalid email or password. Please try again.</span>
            </div>
          )}

          {/* Email */}
          <Field
            label="Email Address" type="email" placeholder="admin@medcred.in"
            value={email} onChange={(e) => { setEmail(e.target.value); setError(false); }}
          />

          {/* Password */}
          <Field
            label="Password" type={showPw ? 'text' : 'password'} placeholder="Enter your password"
            value={password} onChange={(e) => { setPassword(e.target.value); setError(false); }}
            rightSlot={
              <span onClick={() => setShowPw(!showPw)} onKeyDown={handleKeyDown}>
                {showPw ? <IconEyeOn /> : <IconEyeOff />}
              </span>
            }
          />

          {/* Remember me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <span
              onClick={() => setRemember(!remember)}
              style={{
                width: 16, height: 16, borderRadius: 4, flexShrink: 0, cursor: 'pointer',
                border: `1px solid ${remember ? '#1A73E8' : '#E5E7EB'}`,
                background: remember ? '#1A73E8' : 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {remember && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span style={{ fontSize: 13, color: '#6B7280', cursor: 'pointer' }} onClick={() => setRemember(!remember)}>
              Remember me
            </span>
          </div>

          {/* Sign In button */}
          <button
            onClick={doSignIn}
            disabled={empty || loading}
            onMouseEnter={() => setBtnHov(true)}
            onMouseLeave={() => setBtnHov(false)}
            onMouseDown={(e) => { if (!(empty || loading)) e.currentTarget.style.transform = 'scale(0.98)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            style={{
              width: '100%', height: 44,
              background: (empty && !loading) ? '#93C5FD' : btnHov && !loading ? '#1557B0' : '#1A73E8',
              color: 'white', fontSize: 15, fontWeight: 600,
              border: 'none', borderRadius: 6,
              cursor: (empty || loading) ? 'not-allowed' : 'pointer',
              letterSpacing: '0.3px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {loading ? <Spinner /> : 'Sign In'}
          </button>

          {/* Divider */}
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
            <span style={{ fontSize: 11, color: '#9CA3AF', whiteSpace: 'nowrap' }}>secured by</span>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
          </div>

          {/* SSL note */}
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <IconLockSm />
            <span style={{ fontSize: 11, color: '#6B7280' }}>256-bit SSL Encrypted Connection</span>
          </div>
        </div>

        {/* Copyright */}
        <p style={{ position: 'absolute', bottom: 24, fontSize: 11, color: '#9CA3AF', textAlign: 'center' }}>
          © 2024 MedCred India. All rights reserved.
        </p>
      </div>
    </>
  );
}
