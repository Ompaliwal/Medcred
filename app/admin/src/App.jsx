/**
 * App.jsx
 * Root application entry point.
 * Handles auth state, URL-based routing (/admin-login, /admin-panel),
 * logout modal + toast flow, and renders either the Login page or
 * the full AdminPanel based on isLoggedIn state.
 * Uses react-router-dom v7 with BrowserRouter (set up in main.jsx).
 */
import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar, { SIDEBAR_GROUPS } from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';
import AdminProfileDrawer from './components/AdminProfileDrawer';
import LogoutModal from './components/LogoutModal';
import LogoutToast from './components/LogoutToast';
import Login from './pages/Login';
import Icon from './components/Icons';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Claims from './pages/Claims';
import Agents from './pages/Agents';
import Hospitals from './pages/Hospitals';
import KYCQueue from './pages/KYCQueue';
import HealthCards from './pages/HealthCards';
import LoanMonitoring from './pages/LoanMonitoring';
import WalletTxns from './pages/WalletTxns';
import Reports from './pages/Reports';
import './App.css';

/* ─────────────────────────────────────────
   Admin Panel (shown after login)
───────────────────────────────────────── */
function AdminPanel({ onLogoutConfirmed }) {
  const [activeTab, setActiveTab]   = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingVerificationsCount, setPendingVerificationsCount] = useState(5);
  const [toasts, setToasts]         = useState([]);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen]     = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New claim request #MC-9025 submitted.', read: false, time: '2 mins ago' },
    { id: 2, text: 'Agent Deepak Verma completed verification.', read: true, time: '1 hour ago' },
    { id: 3, text: 'System Update: Compliance criteria refreshed.', read: true, time: '1 day ago' },
  ]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const handleCloseToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchQuery('');
  };

  const handleLogout = () => {
    setLogoutModalOpen(false);
    setProfileDrawerOpen(false);
    onLogoutConfirmed();
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard showToast={showToast} searchQuery={searchQuery} pendingVerificationsCount={pendingVerificationsCount} setPendingVerificationsCount={setPendingVerificationsCount} onNavigate={handleTabChange} />;
      case 'users':        return <Users showToast={showToast} />;
      case 'claims':       return <Claims showToast={showToast} />;
      case 'agents':       return <Agents showToast={showToast} />;
      case 'hospitals':    return <Hospitals showToast={showToast} />;
      case 'verifications':return <KYCQueue showToast={showToast} />;
      case 'health-cards': return <HealthCards showToast={showToast} />;
      case 'loans':        return <LoanMonitoring showToast={showToast} />;
      case 'wallet':       return <WalletTxns showToast={showToast} />;
      case 'reports':      return <Reports showToast={showToast} />;
      default: {
        const activeItem = SIDEBAR_GROUPS.flatMap(g => g.items).find(i => i.id === activeTab);
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#1A73E8]/10 flex items-center justify-center mb-4">
              <Icon name={activeItem?.icon || 'grid'} className="text-[#1A73E8]" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#1C1C1E] mb-2">{activeItem?.name || 'Page'}</h3>
            <p className="text-sm text-[#6B7280] max-w-xs">This section is under active development.</p>
          </div>
        );
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans antialiased text-[#1C1C1E] w-full">
      <Toast toasts={toasts} onClose={handleCloseToast} />

      <LogoutModal
        isOpen={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />

      <AdminProfileDrawer
        isOpen={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
        onShowToast={showToast}
        onLogout={() => { setProfileDrawerOpen(false); setLogoutModalOpen(true); }}
      />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        pendingVerificationsCount={pendingVerificationsCount}
        onShowToast={showToast}
        onOpenProfile={() => setProfileDrawerOpen(true)}
        onLogout={() => setLogoutModalOpen(true)}
      />

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-white h-full shadow-2xl z-10 animate-slide-in-right">
            <div className="h-16 flex items-center justify-between px-6 border-b border-[#E5E4E7]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#1A73E8] to-[#155cb4] flex items-center justify-center text-white font-bold text-sm">M</div>
                <span className="font-display font-bold text-sm text-[#1C1C1E]">MedCred India</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-[#6B7280] hover:text-[#1C1C1E] focus:outline-none">
                <Icon name="close" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
              {SIDEBAR_GROUPS.map((group, gi) => (
                <div key={gi} className="mb-2">
                  <div className="px-4 pt-4 pb-1">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-[1px]">{group.label}</span>
                  </div>
                  <div className="px-2 space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <button key={item.id} onClick={() => { handleTabChange(item.id); setMobileMenuOpen(false); }}
                          className={`w-full flex items-center h-[44px] px-4 rounded-lg transition-colors group focus:outline-none ${isActive ? 'bg-[#1A73E8] text-white' : 'text-[#1C1C1E] font-medium hover:bg-[#F0F7FF] hover:text-[#1A73E8]'}`}>
                          <Icon name={item.icon} className={`shrink-0 w-5 h-5 ${isActive ? 'text-white' : 'text-[#6B7280] group-hover:text-[#1A73E8]'}`} />
                          <span className="ml-3 text-[14px] font-medium">{item.name}</span>
                          {item.id === 'verifications' && pendingVerificationsCount > 0 && (
                            <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-[#1A73E8]' : 'bg-[#EA4335] text-white'}`}>{pendingVerificationsCount}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
            <div className="p-4 border-t border-[#E5E4E7] bg-[#F8F9FA]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1A73E8] text-white font-semibold text-xs flex items-center justify-center">SA</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1C1C1E] truncate">Super Admin</p>
                  <p className="text-[10px] text-[#6B7280] truncate">Super Administrator</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setMobileMenuOpen={setMobileMenuOpen}
          notifications={notifications}
          setNotifications={setNotifications}
          onShowToast={showToast}
        />
        <main className="flex-1 flex flex-col min-w-0">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Root App — handles auth + routing
───────────────────────────────────────── */
function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn]           = useState(false);
  const [showLogoutBanner, setShowLogoutBanner] = useState(false);
  const [logoutToastVisible, setLogoutToastVisible] = useState(false);

  const handleLogin = () => {
    setShowLogoutBanner(false);
    setIsLoggedIn(true);
    navigate('/admin-panel');
  };

  const handleLogoutConfirmed = () => {
    setIsLoggedIn(false);
    setLogoutToastVisible(true);
    // Navigate to login, then after toast fades show the banner
    navigate('/admin-login');
    setTimeout(() => {
      setLogoutToastVisible(false);
      setShowLogoutBanner(true);
    }, 2800);
  };

  return (
    <>
      <LogoutToast visible={logoutToastVisible} onClose={() => setLogoutToastVisible(false)} />
      <Routes>
        <Route
          path="/admin-login"
          element={
            isLoggedIn
              ? <Navigate to="/admin-panel" replace />
              : <Login onLogin={handleLogin} showLogoutBanner={showLogoutBanner} />
          }
        />
        <Route
          path="/admin-panel"
          element={
            isLoggedIn
              ? <AdminPanel onLogoutConfirmed={handleLogoutConfirmed} />
              : <Navigate to="/admin-login" replace />
          }
        />
        {/* Catch-all → login */}
        <Route path="*" element={<Navigate to="/admin-login" replace />} />
      </Routes>
    </>
  );
}

export default App;
