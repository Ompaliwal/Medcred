import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';

import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/auth/Login';
import Apply from './pages/apply/Apply';
import RegisterUser from './pages/users/RegisterUser';
import UsersList from './pages/users/UsersList';
import UserDetails from './pages/users/UserDetails';
import Wallet from './pages/wallet/Wallet';
import Incentives from './pages/incentives/Incentives';
import Applications from './pages/applications/Applications';
import Notifications from './pages/notifications/Notifications';
import Profile from './pages/profile/Profile';
import Settings from './pages/settings/Settings';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('agent_authenticated') === 'true';
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('agent_authenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('agent_authenticated');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/apply" element={<Apply />} />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/" 
          element={isAuthenticated ? <DashboardLayout onLogout={handleLogout} /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="users/register" element={<RegisterUser />} />
          <Route path="users/:id/edit" element={<RegisterUser />} />
          <Route path="users" element={<UsersList />} />
          <Route path="users/:id" element={<UserDetails />} />
          <Route path="applications" element={<Applications />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="incentives" element={<Incentives />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
