/**
 * ClaimDetail.jsx
 * Inline claim detail view rendered inside Claims.jsx when a claim row is clicked.
 * Shows: status timeline (Submitted → Under Review → Verified → Decision),
 * claim info card, patient info, uploaded documents list, admin notes textarea,
 * Approve / Reject action buttons.
 * Props: claim | onBack() | onShowToast
 */
import React, { useState } from 'react';

const TIMELINE_STEPS = ['Submitted', 'Under Review', 'Verified', 'Decision'];

function StatusBadge({ status }) {
  const map = {
    Approved:     'bg-[#34A853]/10 text-[#34A853] border-[#34A853]/20',
    Rejected:     'bg-[#EA4335]/10 text-[#EA4335] border-[#EA4335]/20',
    'Under Review': 'bg-[#1A73E8]/10 text-[#1A73E8] border-[#1A73E8]/20',
    Submitted:    'bg-[#FBBC04]/10 text-[#D29E00] border-[#FBBC04]/20',
    Verified:     'bg-[#34A853]/10 text-[#34A853] border-[#34A853]/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${map[status] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
      {status}
    </span>
  );
}

function TimelineStep({ label, index, activeIndex, isLast, finalStatus }) {
  const isDone   = index < activeIndex;
  const isActive = index === activeIndex;
  const isFailed = label === 'Decision' && finalStatus === 'Rejected' && isActive;

  const circleColor = isFailed
    ? 'bg-[#EA4335] border-[#EA4335] text-white'
    : isActive
    ? 'bg-[#1A73E8] border-[#1A73E8] text-white'
    : isDone
    ? 'bg-[#34A853] border-[#34A853] text-white'
    : 'bg-white border-[#E5E4E7] text-[#6B7280]';

  const lineColor  = isDone ? 'bg-[#34A853]' : 'bg-[#E5E4E7]';
  const labelColor = isActive ? (isFailed ? 'text-[#EA4335]' : 'text-[#1A73E8]') : isDone ? 'text-[#34A853]' : 'text-[#6B7280]';
  const displayLabel = label === 'Decision' ? (finalStatus === 'Rejected' ? 'Rejected' : finalStatus === 'Approved' ? 'Approved' : 'Decision') : label;

  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${circleColor}`}>
          {isDone ? (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : isFailed ? (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <span>{index + 1}</span>
          )}
        </div>
        {!isLast && <div className={`w-0.5 h-10 mt-1 ${lineColor} transition-all`} />}
      </div>
      <div className="pb-10">
        <p className={`text-xs font-bold ${labelColor}`}>{displayLabel}</p>
        {isActive && (
          <p className="text-[10px] text-[#6B7280] mt-0.5">
            {isFailed ? 'Claim has been rejected.' : 'Currently at this stage'}
          </p>
        )}
        {isDone && (
          <p className="text-[10px] text-[#6B7280] mt-0.5">Completed</p>
        )}
      </div>
    </div>
  );
}

const CHECKLIST = [
  { label: 'Claim limit within range',     passed: true  },
  { label: 'Card active & valid',          passed: true  },
  { label: 'No duplicate claim found',     passed: true  },
  { label: 'Document verification pending', passed: false },
];

const DOCUMENTS = [
  { label: 'Hospital Bill',       icon: '🏥', color: '#1A73E8' },
  { label: 'Discharge Summary',   icon: '📋', color: '#34A853' },
  { label: 'Prescription',        icon: '💊', color: '#9C27B0' },
];

export default function ClaimDetail({ claim, onBack, onApprove, onReject }) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);

  const getTimelineIndex = (status) => {
    const map = { Submitted: 0, 'Under Review': 1, Verified: 2, Approved: 3, Rejected: 3 };
    return map[status] ?? 0;
  };

  const activeIndex = getTimelineIndex(claim.status);

  const handleApprove = () => {
    setShowRejectBox(false);
    setRejectionReason('');
    onApprove(claim.id);
  };

  const handleReject = () => {
    if (!showRejectBox) { setShowRejectBox(true); return; }
    if (!rejectionReason.trim()) return;
    onReject(claim.id, rejectionReason);
    setRejectionReason('');
    setShowRejectBox(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#1A73E8] transition-colors focus:outline-none group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Claims
        </button>
        <span className="text-[#E5E4E7]">|</span>
        <span className="text-xs text-[#6B7280] font-medium">Claim {claim.id}</span>
        <StatusBadge status={claim.status} />
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* ── LEFT COLUMN (60%) ── */}
        <div className="w-full lg:w-3/5 space-y-5">

          {/* Claim Info Card */}
          <div className="bg-white rounded-xl border border-[#E5E4E7] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E5E4E7] bg-[#F8F9FA] flex justify-between items-center">
              <h3 className="font-display font-bold text-sm text-[#1C1C1E]">Claim Information</h3>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  claim.claimType === 'Hospital'
                    ? 'bg-[#1A73E8]/10 text-[#1A73E8] border-[#1A73E8]/20'
                    : 'bg-[#9C27B0]/10 text-[#9C27B0] border-[#9C27B0]/20'
                }`}
              >
                {claim.claimType === 'Hospital' ? '🏥' : '🏠'} {claim.claimType}
              </span>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4 text-xs">
              {[
                { label: 'Claim ID',        value: claim.id },
                { label: 'Claim Amount',    value: claim.amount, bold: true, color: '#1A73E8' },
                { label: 'Submitted Date',  value: claim.submittedDate },
                { label: 'Claim Type',      value: claim.claimType },
              ].map(({ label, value, bold, color }) => (
                <div key={label}>
                  <p className="text-[10px] text-[#6B7280] uppercase tracking-wide font-semibold mb-1">{label}</p>
                  <p className={`font-bold ${bold ? 'text-base' : 'text-sm'} text-[${color || '#1C1C1E'}]`} style={{ color: color || '#1C1C1E' }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* User Information Card */}
          <div className="bg-white rounded-xl border border-[#E5E4E7] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E5E4E7] bg-[#F8F9FA]">
              <h3 className="font-display font-bold text-sm text-[#1C1C1E]">Cardholder Details</h3>
            </div>
            <div className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1A73E8]/10 text-[#1A73E8] font-bold text-base flex items-center justify-center shrink-0">
                {claim.userName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs flex-1">
                {[
                  { label: 'Full Name', value: claim.userName },
                  { label: 'Card ID',   value: claim.cardId   },
                  { label: 'Mobile',    value: claim.mobile   },
                  { label: 'Plan Type', value: claim.planType },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] text-[#6B7280] uppercase tracking-wide font-semibold mb-0.5">{label}</p>
                    <p className="font-semibold text-[#1C1C1E]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="bg-white rounded-xl border border-[#E5E4E7] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E5E4E7] bg-[#F8F9FA]">
              <h3 className="font-display font-bold text-sm text-[#1C1C1E]">Uploaded Documents</h3>
              <p className="text-[10px] text-[#6B7280] mt-0.5">Supporting documents submitted with this claim</p>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {DOCUMENTS.map((doc) => (
                <div
                  key={doc.label}
                  className="border border-[#E5E4E7] rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
                >
                  {/* Thumbnail area */}
                  <div
                    className="h-24 flex items-center justify-center text-4xl"
                    style={{ background: `${doc.color}0D` }}
                  >
                    <span>{doc.icon}</span>
                  </div>
                  <div className="px-3 py-2.5 flex justify-between items-center bg-white border-t border-[#F3F4F6]">
                    <span className="text-[11px] font-semibold text-[#1C1C1E] truncate">{doc.label}</span>
                    <button
                      className="text-[10px] font-bold text-[#1A73E8] hover:underline focus:outline-none shrink-0 ml-1"
                      onClick={() => {}}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN (40%) ── */}
        <div className="w-full lg:w-2/5 space-y-5 lg:sticky lg:top-24">

          {/* Claim Status Timeline */}
          <div className="bg-white rounded-xl border border-[#E5E4E7] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E5E4E7] bg-[#F8F9FA]">
              <h3 className="font-display font-bold text-sm text-[#1C1C1E]">Status Timeline</h3>
            </div>
            <div className="p-5">
              {TIMELINE_STEPS.map((step, idx) => (
                <TimelineStep
                  key={step}
                  label={step}
                  index={idx}
                  activeIndex={activeIndex}
                  isLast={idx === TIMELINE_STEPS.length - 1}
                  finalStatus={claim.status}
                />
              ))}
            </div>
          </div>

          {/* Validation Checklist */}
          <div className="bg-white rounded-xl border border-[#E5E4E7] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E5E4E7] bg-[#F8F9FA]">
              <h3 className="font-display font-bold text-sm text-[#1C1C1E]">Validation Checklist</h3>
            </div>
            <div className="p-5 space-y-3">
              {CHECKLIST.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      item.passed
                        ? 'bg-[#34A853]/10 text-[#34A853]'
                        : 'bg-[#EA4335]/10 text-[#EA4335]'
                    }`}
                  >
                    {item.passed ? (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-xs font-medium ${item.passed ? 'text-[#1C1C1E]' : 'text-[#EA4335]'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Approve / Reject Actions */}
          {(claim.status === 'Submitted' || claim.status === 'Under Review' || claim.status === 'Verified') && (
            <div className="bg-white rounded-xl border border-[#E5E4E7] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E5E4E7] bg-[#F8F9FA]">
                <h3 className="font-display font-bold text-sm text-[#1C1C1E]">Admin Decision</h3>
              </div>
              <div className="p-5 space-y-4">
                {showRejectBox && (
                  <div className="animate-slide-in space-y-2">
                    <label className="text-[11px] font-bold text-[#EA4335] uppercase tracking-wide block">
                      Rejection Reason <span className="text-[#EA4335]">*</span>
                    </label>
                    <textarea
                      rows="3"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="State the reason for rejecting this claim..."
                      className="w-full p-3 border border-[#EA4335]/40 rounded-lg text-xs bg-[#EA4335]/5 text-[#1C1C1E] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#EA4335]/20 resize-none"
                    />
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={handleApprove}
                    className="flex-1 py-2.5 bg-[#34A853] hover:bg-[#2b8a43] text-white font-bold text-xs rounded-lg transition-colors shadow-sm focus:outline-none flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Approve Claim
                  </button>
                  <button
                    onClick={handleReject}
                    className={`flex-1 py-2.5 font-bold text-xs rounded-lg transition-colors focus:outline-none flex items-center justify-center gap-1.5 ${
                      showRejectBox
                        ? 'bg-[#EA4335] hover:bg-[#c7372c] text-white shadow-sm'
                        : 'border border-[#EA4335] text-[#EA4335] hover:bg-[#EA4335]/5'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {showRejectBox ? 'Confirm Rejection' : 'Reject Claim'}
                  </button>
                </div>
                {showRejectBox && (
                  <button
                    onClick={() => { setShowRejectBox(false); setRejectionReason(''); }}
                    className="w-full text-[10px] text-[#6B7280] hover:text-[#1C1C1E] underline focus:outline-none"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Already Decided Banner */}
          {(claim.status === 'Approved' || claim.status === 'Rejected') && (
            <div className={`rounded-xl border p-4 flex items-center gap-3 ${
              claim.status === 'Approved'
                ? 'bg-[#34A853]/10 border-[#34A853]/20'
                : 'bg-[#EA4335]/10 border-[#EA4335]/20'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                claim.status === 'Approved' ? 'bg-[#34A853] text-white' : 'bg-[#EA4335] text-white'
              }`}>
                {claim.status === 'Approved' ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div>
                <p className={`text-xs font-bold ${claim.status === 'Approved' ? 'text-[#34A853]' : 'text-[#EA4335]'}`}>
                  Claim {claim.status}
                </p>
                <p className="text-[10px] text-[#6B7280]">This claim has been processed.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
