/**
 * Claims.jsx — "Claims" tab
 * Full claims management page.
 * Contains: search + status/type filters, claims table with ID, patient,
 * type, amount, status badge, date. View button → opens ClaimDetail (inline page swap).
 * Props: showToast
 */
import React, { useState, useMemo } from 'react';
import ClaimDetail from './ClaimDetail';

const STATUS_TABS = ['All', 'Submitted', 'Under Review', 'Approved', 'Rejected'];

const INITIAL_CLAIMS = [
  { id: 'CLM-1001', userName: 'Amit Sharma',   cardId: 'MC-U01', mobile: '9876543210', planType: 'Premium Gold',     claimType: 'Hospital',        amount: '₹45,000',   submittedDate: '2026-06-23', status: 'Approved'     },
  { id: 'CLM-1002', userName: 'Priya Patel',    cardId: 'MC-U04', mobile: '9123456789', planType: 'Standard Silver',  claimType: 'Home Treatment',  amount: '₹1,20,000', submittedDate: '2026-06-22', status: 'Under Review' },
  { id: 'CLM-1003', userName: 'Rajesh Kumar',   cardId: 'MC-U03', mobile: '7654321098', planType: 'Premium Platinum', claimType: 'Hospital',        amount: '₹3,50,000', submittedDate: '2026-06-22', status: 'Submitted'    },
  { id: 'CLM-1004', userName: 'Sneha Reddy',    cardId: 'MC-U02', mobile: '8765432109', planType: 'Standard Silver',  claimType: 'Home Treatment',  amount: '₹12,500',   submittedDate: '2026-06-21', status: 'Rejected'     },
  { id: 'CLM-1005', userName: 'Vikram Singh',   cardId: 'MC-U05', mobile: '9812345670', planType: 'Premium Gold',     claimType: 'Hospital',        amount: '₹85,000',   submittedDate: '2026-06-20', status: 'Under Review' },
  { id: 'CLM-1006', userName: 'Ananya Das',     cardId: 'MC-U07', mobile: '9988776655', planType: 'Standard Silver',  claimType: 'Hospital',        amount: '₹3,200',    submittedDate: '2026-06-20', status: 'Approved'     },
  { id: 'CLM-1007', userName: 'Sunita Krishnan',cardId: 'MC-U06', mobile: '9922334455', planType: 'Premium Platinum', claimType: 'Home Treatment',  amount: '₹62,000',   submittedDate: '2026-06-19', status: 'Submitted'    },
];

function ClaimTypePill({ type }) {
  const isHospital = type === 'Hospital';
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
      isHospital
        ? 'bg-[#1A73E8]/10 text-[#1A73E8] border-[#1A73E8]/20'
        : 'bg-[#9C27B0]/10 text-[#9C27B0] border-[#9C27B0]/20'
    }`}>
      {isHospital ? '🏥' : '🏠'} {type}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    Approved:       'bg-[#34A853]/10 text-[#34A853] border-[#34A853]/20',
    Rejected:       'bg-[#EA4335]/10 text-[#EA4335] border-[#EA4335]/20',
    'Under Review': 'bg-[#1A73E8]/10 text-[#1A73E8] border-[#1A73E8]/20',
    Submitted:      'bg-[#FBBC04]/10 text-[#D29E00] border-[#FBBC04]/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${map[status] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
      {status}
    </span>
  );
}

export default function Claims({ showToast }) {
  const [claims, setClaims]           = useState(INITIAL_CLAIMS);
  const [activeTab, setActiveTab]     = useState('All');
  const [dateFrom, setDateFrom]       = useState('');
  const [dateTo, setDateTo]           = useState('');
  const [selectedClaim, setSelectedClaim] = useState(null);

  // Filter claims
  const filteredClaims = useMemo(() => {
    return claims.filter((c) => {
      const matchesTab  = activeTab === 'All' || c.status === activeTab;
      const matchesFrom = !dateFrom || c.submittedDate >= dateFrom;
      const matchesTo   = !dateTo   || c.submittedDate <= dateTo;
      return matchesTab && matchesFrom && matchesTo;
    });
  }, [claims, activeTab, dateFrom, dateTo]);

  // Approve a claim
  const handleApprove = (claimId) => {
    setClaims((prev) =>
      prev.map((c) => c.id === claimId ? { ...c, status: 'Approved' } : c)
    );
    showToast(`Claim ${claimId} has been Approved successfully.`, 'success');
    setSelectedClaim((prev) => prev ? { ...prev, status: 'Approved' } : null);
  };

  // Reject a claim
  const handleReject = (claimId, reason) => {
    setClaims((prev) =>
      prev.map((c) => c.id === claimId ? { ...c, status: 'Rejected' } : c)
    );
    showToast(`Claim ${claimId} has been Rejected. Reason: "${reason.substring(0, 40)}..."`, 'error');
    setSelectedClaim((prev) => prev ? { ...prev, status: 'Rejected' } : null);
  };

  const handleExport = () => {
    showToast('Claims exported as MedCred_Claims_Report.csv', 'success');
  };

  // Show full-page detail view
  if (selectedClaim) {
    return (
      <ClaimDetail
        claim={selectedClaim}
        onBack={() => setSelectedClaim(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">

      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display font-bold text-[22px] text-[#1C1C1E] m-0">Claim Management</h2>
          <p className="text-xs text-[#6B7280] mt-1">Review, approve, and manage all MedCred claim submissions.</p>
        </div>

        {/* Right: Date Range + Export */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white border border-[#E5E4E7] rounded-lg px-3 py-1.5">
            <svg className="w-4 h-4 text-[#6B7280] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-xs text-[#1C1C1E] bg-transparent focus:outline-none w-28"
              title="From date"
            />
            <span className="text-[#6B7280] text-xs font-medium">–</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-xs text-[#1C1C1E] bg-transparent focus:outline-none w-28"
              title="To date"
            />
            {(dateFrom || dateTo) && (
              <button
                onClick={() => { setDateFrom(''); setDateTo(''); }}
                className="text-[#6B7280] hover:text-[#EA4335] text-xs ml-1 focus:outline-none"
                title="Clear dates"
              >✕</button>
            )}
          </div>

          <button
            onClick={handleExport}
            className="border border-[#1A73E8] text-[#1A73E8] hover:bg-[#1A73E8]/5 transition-colors font-semibold px-4 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 focus:outline-none"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1 bg-white border border-[#E5E4E7] rounded-xl p-1 w-fit overflow-x-auto">
        {STATUS_TABS.map((tab) => {
          const count = tab === 'All' ? claims.length : claims.filter((c) => c.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap focus:outline-none ${
                activeTab === tab
                  ? 'bg-[#1A73E8] text-white shadow-sm'
                  : 'text-[#6B7280] hover:text-[#1C1C1E] hover:bg-[#F3F4F6]'
              }`}
            >
              {tab}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab ? 'bg-white/20 text-white' : 'bg-[#F3F4F6] text-[#6B7280]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E4E7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FA] text-[11px] font-bold text-[#6B7280] uppercase tracking-wider border-b border-[#E5E4E7]">
                <th className="py-3.5 px-5 font-semibold">Claim ID</th>
                <th className="py-3.5 px-5 font-semibold">User Name</th>
                <th className="py-3.5 px-5 font-semibold">Claim Type</th>
                <th className="py-3.5 px-5 font-semibold">Amount</th>
                <th className="py-3.5 px-5 font-semibold">Submitted Date</th>
                <th className="py-3.5 px-5 font-semibold">Status</th>
                <th className="py-3.5 px-5 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] text-xs">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-10 h-10 text-[#E5E4E7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm text-[#6B7280] font-medium">No claims match the selected filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-[#1A73E8]/5 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-semibold text-[#6B7280]">{claim.id}</td>
                    <td className="py-3.5 px-5 font-bold text-[#1C1C1E]">{claim.userName}</td>
                    <td className="py-3.5 px-5"><ClaimTypePill type={claim.claimType} /></td>
                    <td className="py-3.5 px-5 font-bold text-[#1C1C1E]">{claim.amount}</td>
                    <td className="py-3.5 px-5 text-[#6B7280] font-medium">{claim.submittedDate}</td>
                    <td className="py-3.5 px-5"><StatusBadge status={claim.status} /></td>
                    <td className="py-3.5 px-5 text-center">
                      <button
                        onClick={() => setSelectedClaim(claim)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A73E8]/10 hover:bg-[#1A73E8]/20 text-[#1A73E8] font-semibold text-[11px] rounded-lg transition-colors focus:outline-none"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-[#E5E4E7] bg-[#F8F9FA] flex justify-between items-center text-xs text-[#6B7280]">
          <span>Showing {filteredClaims.length} of {claims.length} claims</span>
        </div>
      </div>
    </div>
  );
}
