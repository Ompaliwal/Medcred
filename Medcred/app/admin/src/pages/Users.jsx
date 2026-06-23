/**
 * Users.jsx — "Users" tab
 * Full user management page.
 * Contains: search bar + KYC/card status filters, users table with
 * ID, name, mobile, email, card type/status, KYC status, registered date.
 * View button → opens UserDrawer (right-side detail drawer).
 * Block/Unblock toggle per row, Send Notification via UserDrawer.
 * Props: showToast
 */
import React, { useState, useMemo } from 'react';
import UserDrawer from '../components/UserDrawer';

export default function Users({ showToast }) {
  // Users dataset
  const [users, setUsers] = useState([
    { id: 'MC-U01', name: 'Amit Sharma', mobile: '9876543210', email: 'amit.sharma@gmail.com', cardType: 'Premium Gold', kycStatus: 'Verified', cardStatus: 'Active', registeredDate: '2026-04-10', initial: 'AS', familyMembers: 3 },
    { id: 'MC-U02', name: 'Sneha Reddy', mobile: '8765432109', email: 'sneha.reddy@yahoo.com', cardType: 'Standard Silver', kycStatus: 'Rejected', cardStatus: 'Suspended', registeredDate: '2026-05-18', initial: 'SR', familyMembers: 1 },
    { id: 'MC-U03', name: 'Rajesh Kumar', mobile: '7654321098', email: 'rajesh.k@rediffmail.com', cardType: 'Premium Platinum', kycStatus: 'Verified', cardStatus: 'Active', registeredDate: '2025-12-05', initial: 'RK', familyMembers: 4 },
    { id: 'MC-U04', name: 'Priya Patel', mobile: '9123456789', email: 'priya.patel@gmail.com', cardType: 'Standard Silver', kycStatus: 'Pending', cardStatus: 'Active', registeredDate: '2026-06-15', initial: 'PP', familyMembers: 2 },
    { id: 'MC-U05', name: 'Vikram Singh', mobile: '9812345670', email: 'vikram.s@outlook.com', cardType: 'Premium Gold', kycStatus: 'Verified', cardStatus: 'Expired', registeredDate: '2025-05-12', initial: 'VS', familyMembers: 3 },
    { id: 'MC-U06', name: 'Sunita Krishnan', mobile: '9922334455', email: 'sunita.k@gmail.com', cardType: 'Premium Platinum', kycStatus: 'Pending', cardStatus: 'Active', registeredDate: '2026-06-20', initial: 'SK', familyMembers: 2 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);

  // Filter logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.mobile.includes(searchQuery) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = statusFilter === 'All' || user.cardStatus === statusFilter;
      return matchesSearch && matchesFilter;
    });
  }, [users, searchQuery, statusFilter]);

  // Toggle user block/unblock
  const handleBlockToggle = (userId, userName, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, cardStatus: nextStatus } : u))
    );
    
    // Update drawer details if open
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser((prev) => ({ ...prev, cardStatus: nextStatus }));
    }

    if (nextStatus === 'Suspended') {
      showToast(`User ${userName} (${userId}) has been blocked. Card status: Suspended.`, 'error');
    } else {
      showToast(`User ${userName} (${userId}) has been unblocked. Card status: Active.`, 'success');
    }
  };

  // Mock sending notification
  const handleSendNotification = (userId, message) => {
    showToast(`Notification sent to User ${userId}: "${message.substring(0, 30)}..."`, 'success');
  };

  // Export CSV mock trigger
  const handleExport = () => {
    showToast('Registry exported successfully as MedCred_Users_Report.csv', 'success');
  };

  const getKycBadgeStyle = (status) => {
    switch (status) {
      case 'Verified':
        return 'bg-[#34A853]/10 text-[#34A853] border-[#34A853]/20';
      case 'Pending':
        return 'bg-[#FBBC04]/10 text-[#D29E00] border-[#FBBC04]/20';
      case 'Rejected':
        return 'bg-[#EA4335]/10 text-[#EA4335] border-[#EA4335]/20';
      default:
        return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  const getCardBadgeStyle = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-[#34A853]/10 text-[#34A853] border-[#34A853]/20';
      case 'Suspended':
        return 'bg-[#EA4335]/10 text-[#EA4335] border-[#EA4335]/20';
      case 'Expired':
        return 'bg-gray-100 text-gray-500 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-400 border-gray-200';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
      
      {/* Top Bar Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="font-display font-bold text-[22px] text-[#1C1C1E] m-0">
          Users
        </h2>

        {/* Right side search + filter + export button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Global Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search user name, ID, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-[#E5E4E7] rounded-lg text-[#1C1C1E] placeholder-[#6B7280] focus:ring-2 focus:ring-[#1A73E8]/20 focus:outline-none"
            />
          </div>

          {/* Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-[#E5E4E7] rounded-lg px-3 py-1.5 text-[#1C1C1E] focus:ring-2 focus:ring-[#1A73E8]/20 focus:outline-none cursor-pointer"
          >
            <option value="All">All Card Statuses</option>
            <option value="Active">Active Cards</option>
            <option value="Suspended">Suspended Cards</option>
            <option value="Expired">Expired Cards</option>
          </select>

          {/* Export Outline Button */}
          <button
            onClick={handleExport}
            className="border border-[#1A73E8] text-[#1A73E8] hover:bg-[#1A73E8]/5 transition-colors font-semibold px-4.5 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 focus:outline-none"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Main Content Card Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E4E7] overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FA] text-[11px] font-bold text-[#6B7280] uppercase tracking-wider border-b border-[#E5E4E7]">
                <th className="py-3.5 px-5 font-semibold">User ID</th>
                <th className="py-3.5 px-5 font-semibold">Full Name</th>
                <th className="py-3.5 px-5 font-semibold">Mobile</th>
                <th className="py-3.5 px-5 font-semibold">Card Type</th>
                <th className="py-3.5 px-5 font-semibold">KYC Status</th>
                <th className="py-3.5 px-5 font-semibold">Card Status</th>
                <th className="py-3.5 px-5 font-semibold">Registered Date</th>
                <th className="py-3.5 px-5 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-sm text-[#6B7280]">
                    No user accounts match current filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-[#1A73E8]/5 transition-colors"
                  >
                    <td className="py-3.5 px-5 font-semibold text-[#6B7280]">{user.id}</td>
                    <td className="py-3.5 px-5 font-bold text-[#1C1C1E]">{user.name}</td>
                    <td className="py-3.5 px-5 text-[#6B7280] font-medium">{user.mobile}</td>
                    <td className="py-3.5 px-5 text-[#1C1C1E] font-medium">{user.cardType}</td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getKycBadgeStyle(user.kycStatus)}`}>
                        {user.kycStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getCardBadgeStyle(user.cardStatus)}`}>
                        {user.cardStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-[#6B7280] font-medium">{user.registeredDate}</td>
                    <td className="py-3.5 px-5">
                      <div className="flex justify-center gap-3">
                        {/* View Action (Blue Icon) */}
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-1.5 bg-[#1A73E8]/10 hover:bg-[#1A73E8]/20 text-[#1A73E8] rounded-lg transition-colors focus:outline-none"
                          title="View Details"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {/* Block Action (Red Icon) */}
                        <button
                          onClick={() => handleBlockToggle(user.id, user.name, user.cardStatus)}
                          className={`p-1.5 rounded-lg transition-colors focus:outline-none ${
                            user.cardStatus === 'Active'
                              ? 'bg-[#EA4335]/10 hover:bg-[#EA4335]/20 text-[#EA4335]'
                              : 'bg-[#34A853]/10 hover:bg-[#34A853]/20 text-[#34A853]'
                          }`}
                          title={user.cardStatus === 'Active' ? 'Block Cardholder' : 'Unblock Cardholder'}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-[#E5E4E7] flex justify-between items-center text-xs bg-[#F8F9FA] text-[#6B7280]">
          <span>Showing {filteredUsers.length} of {users.length} cardholders</span>
        </div>
      </div>

      {/* Slide-over Profile Drawer (Side panel overlay, not blocker modal) */}
      {selectedUser && (
        <>
          {/* Backdrop (Allows clicks to dismiss, non-modal but aids focus) */}
          <div
            className="fixed inset-0 bg-transparent z-30"
            onClick={() => setSelectedUser(null)}
          />
          <UserDrawer
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onBlockToggle={handleBlockToggle}
            onSendNotification={handleSendNotification}
          />
        </>
      )}

    </div>
  );
}
