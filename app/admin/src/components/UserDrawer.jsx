/**
 * UserDrawer.jsx
 * Right-side detail drawer for a selected user (opened from the Users page).
 * Contains:
 *   - Profile summary (avatar, name, email, mobile)
 *   - Card Credentials (card number, type, status, issue/expiry dates)
 *   - KYC Verification (status badge, document type, registered date)
 *   - Account Information (family members count)
 *   - Claims History (total claims, volume, last claim date)
 *   - Inline "Send Notification" form (textarea, send/cancel)
 * Footer: Send Notification toggle | Block/Unblock User button
 * Props: user | onClose | onBlockToggle(id, name, cardStatus) | onSendNotification(id, text)
 */
import React, { useState } from 'react';
import Icon from './Icons';

export default function UserDrawer({ user, onClose, onBlockToggle, onSendNotification }) {
  const [notifText, setNotifText] = useState('');
  const [showNotifInput, setShowNotifInput] = useState(false);

  if (!user) return null;

  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!notifText.trim()) return;
    onSendNotification(user.id, notifText);
    setNotifText('');
    setShowNotifInput(false);
  };

  // Mocking claims list and details for the drawer
  const mockClaimSummary = {
    totalClaims: user.id === 'MC-U01' || user.id === 'MC-U03' ? 3 : user.id === 'MC-U02' ? 0 : 1,
    totalAmount: user.id === 'MC-U01' ? '₹1,30,000' : user.id === 'MC-U03' ? '₹3,62,500' : user.id === 'MC-U02' ? '₹0' : '₹85,000',
    lastClaimDate: user.id === 'MC-U01' ? '2026-06-23' : user.id === 'MC-U03' ? '2026-06-22' : 'N/A',
  };

  const mockCardDetails = {
    cardNumber: `8840-9012-7489-${user.id.split('-')[1] || '0000'}`,
    issueDate: '2025-08-15',
    expiryDate: user.cardStatus === 'Expired' ? '2026-05-15' : '2029-08-15',
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-white border-l border-[#E5E4E7] shadow-2xl flex flex-col animate-slide-in-right font-sans">
      
      {/* Header */}
      <div className="p-5 border-b border-[#E5E4E7] flex justify-between items-center bg-[#F8F9FA]">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider block">User Profile Detail</span>
          <h3 className="font-display font-bold text-lg text-[#1C1C1E] mt-0.5">Details Overview</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-[#6B7280] hover:text-[#1C1C1E] hover:bg-[#F3F4F6] rounded-full transition-all focus:outline-none"
        >
          <Icon name="close" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Profile Card Summary */}
        <div className="flex items-center gap-4 pb-6 border-b border-[#F3F4F6]">
          {/* Mock Profile Picture or Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1A73E8] to-[#155cb4] text-white font-bold text-xl flex items-center justify-center shadow-md">
            {user.initial}
          </div>
          <div>
            <h4 className="font-display font-bold text-base text-[#1C1C1E]">{user.name}</h4>
            <p className="text-xs text-[#6B7280] font-medium">{user.email}</p>
            <p className="text-xs text-[#6B7280] font-medium mt-0.5">{user.mobile}</p>
          </div>
        </div>

        {/* MedCred Card Details */}
        <div className="space-y-3">
          <h5 className="font-display font-bold text-xs text-[#6B7280] uppercase tracking-wider">Card Credentials</h5>
          <div className="bg-[#F8F9FA] rounded-xl p-4 border border-[#E5E4E7] space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#6B7280] font-medium">Card Number:</span>
              <span className="font-mono font-semibold text-[#1C1C1E]">{mockCardDetails.cardNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280] font-medium">Card Type:</span>
              <span className="font-bold text-[#1C1C1E]">{user.cardType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280] font-medium">Card Status:</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  user.cardStatus === 'Active'
                    ? 'bg-[#34A853]/10 text-[#34A853] border-[#34A853]/20'
                    : user.cardStatus === 'Suspended'
                    ? 'bg-[#EA4335]/10 text-[#EA4335] border-[#EA4335]/20'
                    : 'bg-gray-100 text-gray-500 border-gray-200'
                }`}
              >
                {user.cardStatus}
              </span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-[#E5E4E7]/60">
              <span className="text-[#6B7280] font-medium">Issue Date:</span>
              <span className="font-semibold text-[#1C1C1E]">{mockCardDetails.issueDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280] font-medium">Expiry Date:</span>
              <span className="font-semibold text-[#1C1C1E]">{mockCardDetails.expiryDate}</span>
            </div>
          </div>
        </div>

        {/* KYC Verification Info */}
        <div className="space-y-3">
          <h5 className="font-display font-bold text-xs text-[#6B7280] uppercase tracking-wider">KYC Verification</h5>
          <div className="bg-[#F8F9FA] rounded-xl p-4 border border-[#E5E4E7] space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#6B7280] font-medium">KYC Status:</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  user.kycStatus === 'Verified'
                    ? 'bg-[#34A853]/10 text-[#34A853] border-[#34A853]/20'
                    : user.kycStatus === 'Pending'
                    ? 'bg-[#FBBC04]/10 text-[#D29E00] border-[#FBBC04]/20'
                    : 'bg-[#EA4335]/10 text-[#EA4335] border-[#EA4335]/20'
                }`}
              >
                {user.kycStatus}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280] font-medium">ID Document type:</span>
              <span className="font-bold text-[#1C1C1E]">Aadhaar Card</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280] font-medium">Registered Date:</span>
              <span className="font-semibold text-[#1C1C1E]">{user.registeredDate}</span>
            </div>
          </div>
        </div>

        {/* Family Information */}
        <div className="space-y-3">
          <h5 className="font-display font-bold text-xs text-[#6B7280] uppercase tracking-wider">Account Information</h5>
          <div className="bg-[#F8F9FA] rounded-xl p-4 border border-[#E5E4E7] flex justify-between items-center text-xs">
            <span className="text-[#6B7280] font-medium">Family Members Registered:</span>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="font-bold text-sm text-[#1C1C1E]">{user.familyMembers}</span>
            </div>
          </div>
        </div>

        {/* Claims Activity Summary */}
        <div className="space-y-3">
          <h5 className="font-display font-bold text-xs text-[#6B7280] uppercase tracking-wider">Claims History</h5>
          <div className="bg-[#F8F9FA] rounded-xl p-4 border border-[#E5E4E7] space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#6B7280] font-medium">Total Claims Filed:</span>
              <span className="font-bold text-[#1C1C1E]">{mockClaimSummary.totalClaims}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280] font-medium">Total Claims Volume:</span>
              <span className="font-bold text-[#34A853]">{mockClaimSummary.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280] font-medium">Last Claim Date:</span>
              <span className="font-semibold text-[#1C1C1E]">{mockClaimSummary.lastClaimDate}</span>
            </div>
          </div>
        </div>

        {/* Trigger inline Send Notification form */}
        {showNotifInput && (
          <form onSubmit={handleSendNotification} className="border border-[#1A73E8]/20 bg-[#1A73E8]/5 rounded-xl p-4 space-y-3 animate-slide-in">
            <span className="text-xs font-bold text-[#1A73E8] block">Compose Alert Notification</span>
            <textarea
              rows="3"
              value={notifText}
              onChange={(e) => setNotifText(e.target.value)}
              placeholder="Type message to send to user..."
              className="w-full p-2 border border-[#E5E4E7] rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20"
              required
            />
            <div className="flex justify-end gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => setShowNotifInput(false)}
                className="px-2.5 py-1.5 border border-gray-300 rounded text-[#6B7280] hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-2.5 py-1.5 bg-[#1A73E8] hover:bg-[#155cb4] text-white font-semibold rounded shadow-sm"
              >
                Send Message
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Action triggers Footer */}
      <div className="bg-[#F8F9FA] px-6 py-4 border-t border-[#E5E4E7] flex justify-between gap-3">
        <button
          onClick={() => setShowNotifInput(!showNotifInput)}
          className="flex-1 py-2 px-3 border border-[#1A73E8]/40 hover:bg-[#1A73E8]/5 text-[#1A73E8] font-semibold text-xs rounded-lg transition-colors focus:outline-none flex items-center justify-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Send Notification
        </button>
        <button
          onClick={() => onBlockToggle(user.id, user.name, user.cardStatus)}
          className={`flex-1 py-2 px-3 font-semibold text-xs rounded-lg transition-colors focus:outline-none flex items-center justify-center gap-1.5 border ${
            user.cardStatus === 'Active'
              ? 'border-[#EA4335] hover:bg-[#EA4335]/5 text-[#EA4335]'
              : 'border-[#34A853] hover:bg-[#34A853]/5 text-[#34A853]'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          {user.cardStatus === 'Active' ? 'Block User' : 'Unblock User'}
        </button>
      </div>

    </div>
  );
}
