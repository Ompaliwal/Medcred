/**
 * VerificationsList.jsx
 * Pending verifications panel used on the Dashboard page (right column).
 * Shows: avatar initials, name, verification type, registration number, date.
 * Clicking a row opens the VerificationModal via onSelectVerification.
 * Props: verifications (filtered array) | onSelectVerification(item) | onShowToast
 */
import React from 'react';

export default function VerificationsList({
  verifications,
  onSelectVerification,
  onShowToast,
}) {
  return (
    <div className="w-full lg:w-2/5 bg-white rounded-xl shadow-sm border border-[#E5E4E7] flex flex-col">
      {/* List Header */}
      <div className="p-5 border-b border-[#E5E4E7] flex justify-between items-center">
        <div>
          <h3 className="font-display font-bold text-base text-[#1C1C1E]">Pending Verifications</h3>
          <p className="text-xs text-[#6B7280] mt-0.5">Professional credentials awaiting validation</p>
        </div>
        <span className="bg-[#EA4335]/15 text-[#EA4335] text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
          {verifications.length} Awaiting
        </span>
      </div>

      {/* Verification Items */}
      <div className="divide-y divide-[#F3F4F6] p-1 flex-1">
        {verifications.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#6B7280]">
            No pending verifications found.
          </div>
        ) : (
          verifications.map((item) => (
            <div
              key={item.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-[#F8F9FA] rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#1A73E8]/10 text-[#1A73E8] font-bold text-xs flex items-center justify-center shrink-0">
                  {item.initial}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#1C1C1E] truncate">{item.name}</p>
                  <p className="text-[10px] text-[#6B7280] truncate font-medium">{item.type}</p>
                </div>
              </div>
              
              <button
                onClick={() => onSelectVerification(item)}
                className="bg-[#1A73E8] text-white hover:bg-[#155cb4] transition-colors px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 shadow-sm focus:outline-none"
              >
                Review
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#E5E4E7] bg-[#F8F9FA] rounded-b-xl flex justify-center">
        <button
          onClick={() => onShowToast && onShowToast('Full verification registry loaded', 'success')}
          className="text-xs font-semibold text-[#1A73E8] hover:underline focus:outline-none"
        >
          Manage Professional Credentialing &rarr;
        </button>
      </div>
    </div>
  );
}
