/**
 * KYCQueue.jsx — "KYC Verification" tab
 * Split-panel KYC review page.
 * Left (35%): scrollable queue list with applicant name, ID, type badge, timestamp.
 *             Search input (UI only — no state wired, filtering not yet implemented).
 * Right (65%): selected applicant detail view with:
 *   - Applicant Details card (name, DOB, mobile, Aadhaar, address)
 *   - Document Preview (Aadhaar front/back placeholders)
 *   - System Validation checks (Name Match, DOB Match, Duplicate Check)
 *   - Action bar: Request More Info | Reject | Verify KYC
 * Approving/rejecting removes the item from the queue and auto-selects the next.
 * Props: showToast
 */
import React, { useState } from 'react';

const INITIAL_QUEUE = [
  {
    id: 'KYC-801', name: 'Rahul Sharma', time: '10 mins ago', type: 'New User',
    dob: '14/08/1992', mobile: '9876543210', address: 'B-402, Green Park, Andheri East, Mumbai, 400069',
    aadhaar: 'XXXX-XXXX-4521',
    match: { name: true, dob: true, duplicate: true },
    docs: { front: 'aadhaar_front.jpg', back: 'aadhaar_back.jpg' }
  },
  {
    id: 'KYC-802', name: 'Priya Verma', time: '25 mins ago', type: 'Family Member',
    dob: '22/11/1995', mobile: '9123456789', address: '7, Sector 44, Gurugram, New Delhi, 110001',
    aadhaar: 'XXXX-XXXX-8902',
    match: { name: true, dob: false, duplicate: true },
    docs: { front: 'aadhaar_front.jpg', back: 'aadhaar_back.jpg' }
  },
  {
    id: 'KYC-803', name: 'Sanjay Gupta', time: '1 hour ago', type: 'New User',
    dob: '05/03/1988', mobile: '9811223344', address: '15, Park Street, Kolkata, 700016',
    aadhaar: 'XXXX-XXXX-1122',
    match: { name: true, dob: true, duplicate: false },
    docs: { front: 'aadhaar_front.jpg', back: 'aadhaar_back.jpg' }
  },
  {
    id: 'KYC-804', name: 'Anjali Desai', time: '2 hours ago', type: 'Family Member',
    dob: '19/09/2001', mobile: '9988776655', address: '32, MG Road, Camp, Pune, 411001',
    aadhaar: 'XXXX-XXXX-7654',
    match: { name: true, dob: true, duplicate: true },
    docs: { front: 'aadhaar_front.jpg', back: 'aadhaar_back.jpg' }
  },
  {
    id: 'KYC-805', name: 'Vikram Singh', time: '3 hours ago', type: 'New User',
    dob: '12/12/1975', mobile: '9900112233', address: '1-8-31/1, Secunderabad, Hyderabad, 500003',
    aadhaar: 'XXXX-XXXX-3344',
    match: { name: false, dob: true, duplicate: true },
    docs: { front: 'aadhaar_front.jpg', back: 'aadhaar_back.jpg' }
  }
];

function TypeBadge({ type }) {
  const isNew = type === 'New User';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
      isNew ? 'bg-[#1A73E8]/10 text-[#1A73E8] border-[#1A73E8]/20' : 'bg-[#9C27B0]/10 text-[#9C27B0] border-[#9C27B0]/20'
    }`}>
      {type}
    </span>
  );
}

export default function KYCQueue({ showToast }) {
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [selectedId, setSelectedId] = useState(INITIAL_QUEUE[0]?.id || null);

  const selectedItem = queue.find(q => q.id === selectedId);

  const handleAction = (id, actionName, toastType) => {
    setQueue(prev => prev.filter(item => item.id !== id));
    if (selectedId === id) {
      const remaining = queue.filter(item => item.id !== id);
      setSelectedId(remaining.length > 0 ? remaining[0].id : null);
    }
    showToast(`Verification ${id} ${actionName}`, toastType);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F9FA]">
      {/* Top Bar */}
      <div className="px-6 py-4 bg-white border-b border-[#E5E4E7] flex justify-between items-center shrink-0">
        <div>
          <h2 className="font-display font-bold text-[22px] text-[#1C1C1E] m-0">KYC Verification Queue</h2>
          <p className="text-xs text-[#6B7280] mt-1">Review pending user and family member KYC documents.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#FBBC04]/10 border border-[#FBBC04]/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FBBC04] animate-pulse"></span>
            <span className="text-xs font-bold text-[#D29E00]">{queue.length} Pending</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL: Queue List (35%) */}
        <div className="w-[35%] bg-white border-r border-[#E5E4E7] flex flex-col h-full overflow-hidden shrink-0">
          <div className="p-3 border-b border-[#E5E4E7] bg-[#F8F9FA]">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search name or ID..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-[#E5E4E7] rounded-lg text-[#1C1C1E] placeholder-[#6B7280] focus:ring-2 focus:ring-[#1A73E8]/20 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {queue.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <svg className="w-12 h-12 text-[#E5E4E7] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-semibold text-[#6B7280]">Queue is empty</p>
                <p className="text-xs text-[#9CA3AF] mt-1">All verifications are caught up.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#F3F4F6]">
                {queue.map(item => {
                  const isActive = item.id === selectedId;
                  const initials = item.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`w-full flex items-start gap-3 p-4 transition-colors text-left relative focus:outline-none ${
                        isActive ? 'bg-[#1A73E8]/5' : 'hover:bg-[#F8F9FA]'
                      }`}
                    >
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1A73E8]" />}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        isActive ? 'bg-[#1A73E8] text-white' : 'bg-[#F3F4F6] text-[#6B7280]'
                      }`}>
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-sm font-bold truncate ${isActive ? 'text-[#1A73E8]' : 'text-[#1C1C1E]'}`}>
                            {item.name}
                          </p>
                          <span className="text-[10px] text-[#6B7280] font-medium whitespace-nowrap ml-2">
                            {item.time}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1.5">
                          <span className="text-xs text-[#6B7280] font-mono">{item.id}</span>
                          <TypeBadge type={item.type} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Details (65%) */}
        <div className="w-[65%] flex flex-col h-full overflow-hidden bg-[#F8F9FA]">
          {selectedItem ? (
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* User Info Card */}
                <div className="bg-white rounded-xl shadow-sm border border-[#E5E4E7] overflow-hidden">
                  <div className="px-5 py-3 border-b border-[#E5E4E7] bg-[#F8F9FA] flex justify-between items-center">
                    <h3 className="font-display font-bold text-sm text-[#1C1C1E]">Applicant Details</h3>
                    <span className="text-xs text-[#6B7280] font-mono">{selectedItem.id}</span>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    <div>
                      <p className="text-[10px] text-[#6B7280] uppercase font-bold tracking-wide mb-1">Full Name</p>
                      <p className="font-semibold text-[#1C1C1E]">{selectedItem.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#6B7280] uppercase font-bold tracking-wide mb-1">Date of Birth</p>
                      <p className="font-semibold text-[#1C1C1E]">{selectedItem.dob}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#6B7280] uppercase font-bold tracking-wide mb-1">Mobile</p>
                      <p className="font-semibold text-[#1C1C1E]">{selectedItem.mobile}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#6B7280] uppercase font-bold tracking-wide mb-1">Aadhaar Number</p>
                      <p className="font-semibold text-[#1A73E8] font-mono">{selectedItem.aadhaar}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] text-[#6B7280] uppercase font-bold tracking-wide mb-1">Address</p>
                      <p className="font-semibold text-[#1C1C1E]">{selectedItem.address}</p>
                    </div>
                  </div>
                </div>

                {/* Match Results & Document Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Documents */}
                  <div className="bg-white rounded-xl shadow-sm border border-[#E5E4E7] overflow-hidden flex flex-col">
                    <div className="px-5 py-3 border-b border-[#E5E4E7] bg-[#F8F9FA]">
                      <h3 className="font-display font-bold text-sm text-[#1C1C1E]">Document Preview</h3>
                    </div>
                    <div className="p-5 flex-1 space-y-4">
                      <div className="border border-[#E5E4E7] rounded-lg p-2 bg-[#F3F4F6] flex flex-col items-center justify-center h-32 relative group cursor-pointer overflow-hidden">
                        <div className="absolute inset-0 bg-[#1A73E8]/10 group-hover:bg-[#1A73E8]/20 transition-colors"></div>
                        <svg className="w-8 h-8 text-[#1A73E8] mb-2 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-bold text-[#1C1C1E] relative z-10">Aadhaar Front</span>
                        <span className="text-[10px] text-[#6B7280] relative z-10">Click to enlarge</span>
                      </div>
                      <div className="border border-[#E5E4E7] rounded-lg p-2 bg-[#F3F4F6] flex flex-col items-center justify-center h-32 relative group cursor-pointer overflow-hidden">
                        <div className="absolute inset-0 bg-[#1A73E8]/10 group-hover:bg-[#1A73E8]/20 transition-colors"></div>
                        <svg className="w-8 h-8 text-[#1A73E8] mb-2 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-bold text-[#1C1C1E] relative z-10">Aadhaar Back</span>
                        <span className="text-[10px] text-[#6B7280] relative z-10">Click to enlarge</span>
                      </div>
                    </div>
                  </div>

                  {/* Validation Checks */}
                  <div className="bg-white rounded-xl shadow-sm border border-[#E5E4E7] overflow-hidden flex flex-col">
                    <div className="px-5 py-3 border-b border-[#E5E4E7] bg-[#F8F9FA]">
                      <h3 className="font-display font-bold text-sm text-[#1C1C1E]">System Validation</h3>
                    </div>
                    <div className="p-5 flex-1 space-y-4">
                      {[
                        { label: 'Name Match', passed: selectedItem.match.name },
                        { label: 'DOB Match', passed: selectedItem.match.dob },
                        { label: 'Duplicate Check', passed: selectedItem.match.duplicate }
                      ].map(check => (
                        <div key={check.label} className={`flex items-center gap-3 p-3 rounded-lg border ${
                          check.passed ? 'bg-[#34A853]/5 border-[#34A853]/20' : 'bg-[#EA4335]/5 border-[#EA4335]/20'
                        }`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                            check.passed ? 'bg-[#34A853] text-white' : 'bg-[#EA4335] text-white'
                          }`}>
                            {check.passed ? (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className={`text-xs font-bold ${check.passed ? 'text-[#34A853]' : 'text-[#EA4335]'}`}>
                              {check.label} {check.passed ? '✓' : '✗'}
                            </p>
                            <p className="text-[10px] text-[#6B7280]">
                              {check.passed ? 'Validated successfully against document.' : 'Mismatch detected. Review required.'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="bg-white px-6 py-4 border-t border-[#E5E4E7] flex justify-end gap-3 shrink-0">
                <button
                  onClick={() => handleAction(selectedItem.id, 'requested more info', 'error')}
                  className="px-5 py-2.5 border border-[#1A73E8] text-[#1A73E8] hover:bg-[#1A73E8]/5 font-bold text-xs rounded-lg transition-colors focus:outline-none"
                >
                  Request More Info
                </button>
                <button
                  onClick={() => handleAction(selectedItem.id, 'rejected', 'error')}
                  className="px-5 py-2.5 bg-[#EA4335] hover:bg-[#c7372c] text-white font-bold text-xs rounded-lg transition-colors shadow-sm focus:outline-none"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(selectedItem.id, 'verified', 'success')}
                  className="px-6 py-2.5 bg-[#34A853] hover:bg-[#2b8a43] text-white font-bold text-xs rounded-lg transition-colors shadow-sm focus:outline-none flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Verify KYC
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-center p-6">
              <div>
                <svg className="w-16 h-16 text-[#E5E4E7] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                </svg>
                <p className="text-base font-bold text-[#1C1C1E]">No Selection</p>
                <p className="text-sm text-[#6B7280] mt-1">Select an item from the queue to review details.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
