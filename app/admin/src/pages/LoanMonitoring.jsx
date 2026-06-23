/**
 * LoanMonitoring.jsx — "Loan Monitoring" tab
 * Monitors MedCred users' loan eligibility and active loans.
 * Eligibility rule: user must hold a MedCred card for ≥30 days.
 * Contains:
 *   - Search bar + eligibility filter + Export button
 *   - 3 summary stat cards (Total Eligible / Waiting Period / Active Loans)
 *   - Tab bar: All Users / Eligible / Waiting Period / Loan Active / Blocked
 *   - Table with user, mobile, card purchase date, 30-day progress bar,
 *     eligibility badge, loan status badge, view action
 *   - View button → opens LoanDrawer (right-side detail drawer) with:
 *       horizontal eligibility timeline (3 steps), loan restriction info,
 *       active loan details, block/unblock action
 * Props: showToast
 */
import React, { useState, useMemo } from 'react';

const INITIAL_LOANS = [
  {
    id: 'L-101', userName: 'Rahul Sharma', mobile: '9876543210', cardId: 'MC-2401',
    purchaseDate: '15 May 2026', daysSince: 38, eligibility: 'Eligible', loanStatus: 'Active',
    loanDetails: { amount: '₹15,000', date: '25 Jun 2026', status: 'Disbursed' }
  },
  {
    id: 'L-102', userName: 'Priya Verma', mobile: '9123456789', cardId: 'MC-2402',
    purchaseDate: '10 Jun 2026', daysSince: 13, eligibility: '17 Days Left', loanStatus: 'No Loan',
    loanDetails: null
  },
  {
    id: 'L-103', userName: 'Sanjay Gupta', mobile: '9811223344', cardId: 'MC-2403',
    purchaseDate: '01 Mar 2026', daysSince: 114, eligibility: 'Eligible', loanStatus: 'Blocked',
    loanDetails: null
  },
  {
    id: 'L-104', userName: 'Anjali Desai', mobile: '9988776655', cardId: 'MC-2404',
    purchaseDate: '20 Jun 2026', daysSince: 3, eligibility: '27 Days Left', loanStatus: 'No Loan',
    loanDetails: null
  },
  {
    id: 'L-105', userName: 'Vikram Singh', mobile: '9900112233', cardId: 'MC-2405',
    purchaseDate: '05 May 2026', daysSince: 49, eligibility: 'Not Eligible', loanStatus: 'Blocked',
    loanDetails: null
  },
  {
    id: 'L-106', userName: 'Neha Patel', mobile: '9822113344', cardId: 'MC-2406',
    purchaseDate: '22 May 2026', daysSince: 32, eligibility: 'Eligible', loanStatus: 'Applied',
    loanDetails: { amount: '₹10,000', date: '23 Jun 2026', status: 'Under Review' }
  }
];

const TABS = ['All Users', 'Eligible', 'Waiting Period', 'Loan Active', 'Blocked'];

// ── Local mini stat card (icon as JSX, used only in this page) ──
function MiniStatCard({ label, value, icon, color }) {
  return (
    <div className="flex-1 bg-white rounded-[10px] shadow-sm p-4 flex items-center gap-4 border border-[#E5E7EB]">
      <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}1A`, color }}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-[#1C1C1E] leading-tight">{value}</p>
        <p className="text-xs text-[#6B7280] font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function ProgressTracker({ days }) {
  const progress = Math.min(days, 30);
  const percent = (progress / 30) * 100;
  const isComplete = days >= 30;
  const fillColor = isComplete ? 'bg-[#34A853]' : 'bg-[#1A73E8]';

  return (
    <div className="w-full max-w-[120px]">
      <div className="h-1.5 w-full bg-[#E5E7EB] rounded-full overflow-hidden mb-1">
        <div className={`h-full ${fillColor} transition-all`} style={{ width: `${percent}%` }}></div>
      </div>
      <p className="text-[10px] text-[#6B7280] font-medium">{progress}/30 days</p>
    </div>
  );
}

function EligibilityBadge({ status }) {
  const isEligible = status === 'Eligible';
  const isNotEligible = status === 'Not Eligible';
  
  if (isEligible) return <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F4EA] text-[#34A853]">{status}</span>;
  if (isNotEligible) return <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FCE8E6] text-[#EA4335]">{status}</span>;
  
  // Waiting period (e.g., "14 Days Left")
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF7E0] text-[#F9A825]">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {status}
    </span>
  );
}

function LoanStatusBadge({ status }) {
  const map = {
    'No Loan': 'bg-[#F1F3F4] text-[#6B7280]',
    'Applied': 'bg-[#EEF4FD] text-[#1A73E8]',
    'Active':  'bg-[#E6F4EA] text-[#34A853]',
    'Blocked': 'bg-[#FCE8E6] text-[#EA4335]',
  };
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${map[status] || 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  );
}

// ── Drawer Component ──
function LoanDrawer({ user, onClose, onBlockToggle }) {
  if (!user) return null;

  const initials = user.userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  // Determine timeline states
  const step1Done = true; // Card is purchased
  const step2Done = user.daysSince >= 30; // 30 day period complete
  const step3Done = user.eligibility === 'Eligible' && user.loanStatus !== 'Blocked';

  const stepColor = (done, isActive, isFailed) => {
    if (isFailed) return 'bg-[#EA4335] border-[#EA4335] text-white';
    if (done) return 'bg-[#34A853] border-[#34A853] text-white';
    if (isActive) return 'bg-[#1A73E8] border-[#1A73E8] text-white shadow-[0_0_0_4px_rgba(26,115,232,0.2)]';
    return 'bg-white border-[#E5E7EB] text-[#D1D5DB]';
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-[400px] bg-white border-l border-[#E5E7EB] shadow-2xl flex flex-col animate-slide-in-right font-sans">
      {/* Drawer Header */}
      <div className="px-5 py-4 border-b border-[#E5E7EB] flex justify-between items-center bg-white shrink-0">
        <h3 className="font-display font-bold text-lg text-[#1C1C1E]">Loan Eligibility Detail</h3>
        <button onClick={onClose} className="p-1.5 text-[#6B7280] hover:text-[#1C1C1E] hover:bg-[#F3F4F6] rounded-full transition-all focus:outline-none">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Section 1: User Info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#1A73E8] text-white font-bold text-xl flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div>
            <h4 className="font-bold text-[#1C1C1E] text-base">{user.userName}</h4>
            <p className="text-xs text-[#6B7280] font-medium mt-0.5">{user.mobile}</p>
            <p className="text-[11px] text-[#1A73E8] font-mono mt-0.5">{user.cardId}</p>
          </div>
        </div>

        {/* Section 2: Eligibility Timeline (Horizontal) */}
        <div>
          <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-4">Eligibility Timeline</h4>
          <div className="relative flex justify-between items-center px-4">
            {/* Connecting lines */}
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-[#E5E7EB] -z-10">
              <div className={`h-full ${step2Done ? 'bg-[#34A853]' : 'bg-[#1A73E8]'} transition-all`} style={{ width: step2Done ? '100%' : '50%' }}></div>
            </div>

            {/* Step 1: Card Purchased */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${stepColor(true, false, false)}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[10px] font-bold text-[#1C1C1E] mt-2 whitespace-nowrap">Card Purchased</p>
              <p className="text-[9px] text-[#6B7280]">{user.purchaseDate}</p>
            </div>

            {/* Step 2: 30 Day Period */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white z-10 transition-all ${
                step2Done ? stepColor(true, false, false) : stepColor(false, true, false)
              }`}>
                {step2Done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs font-bold text-[#1A73E8]">2</span>
                )}
              </div>
              <p className={`text-[10px] font-bold mt-2 whitespace-nowrap ${step2Done ? 'text-[#1C1C1E]' : 'text-[#1A73E8]'}`}>30 Day Period</p>
              <p className="text-[9px] text-[#6B7280]">
                {step2Done ? 'Completed' : `${user.daysSince}/30 Days`}
              </p>
            </div>

            {/* Step 3: Loan Eligible */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white z-10 ${
                step3Done ? stepColor(true, false, false) : (user.loanStatus === 'Blocked' || user.eligibility === 'Not Eligible' ? stepColor(false, false, true) : stepColor(false, false, false))
              }`}>
                {step3Done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : user.loanStatus === 'Blocked' || user.eligibility === 'Not Eligible' ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>
              <p className={`text-[10px] font-bold mt-2 whitespace-nowrap ${step3Done ? 'text-[#1C1C1E]' : 'text-[#6B7280]'}`}>Loan Eligible</p>
              <p className="text-[9px] text-[#6B7280]">
                {step3Done ? 'Ready' : (user.loanStatus === 'Blocked' || user.eligibility === 'Not Eligible' ? 'Rejected' : 'Locked')}
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Loan Restriction Info */}
        <div>
          <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-3">Loan Details</h4>
          <div className="bg-[#FFFDE7] rounded-xl border border-[#FBBC04]/30 p-4 shadow-sm flex gap-3 items-start mb-4">
            <svg className="w-5 h-5 text-[#FBBC04] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-xs font-bold text-[#1C1C1E]">Only 1 loan allowed per user</p>
              <p className="text-[10px] text-[#6B7280] mt-0.5">MedCred policy restricts users from taking simultaneous loans. Previous loans must be fully cleared.</p>
            </div>
          </div>

          <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl p-4">
            {user.loanDetails ? (
              <div className="grid grid-cols-2 gap-y-3">
                <div>
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase">Active Loan Amount</p>
                  <p className="text-sm font-bold text-[#1C1C1E] mt-0.5">{user.loanDetails.amount}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase">Applied On</p>
                  <p className="text-xs font-semibold text-[#1C1C1E] mt-0.5">{user.loanDetails.date}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase">Loan Status</p>
                  <p className="text-xs font-semibold text-[#1A73E8] mt-0.5">{user.loanDetails.status}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-xs font-semibold text-[#6B7280]">No active loan</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-5 border-t border-[#E5E7EB] bg-[#F8F9FA] shrink-0">
        <button
          onClick={() => onBlockToggle(user)}
          className={`w-full py-2.5 font-bold text-xs rounded-lg transition-colors focus:outline-none border ${
            user.loanStatus === 'Blocked'
              ? 'bg-[#34A853] hover:bg-[#2b8a43] text-white border-[#34A853] shadow-sm'
              : 'border-[#EA4335] text-[#EA4335] hover:bg-[#EA4335]/5'
          }`}
        >
          {user.loanStatus === 'Blocked' ? 'Unblock Loan Application' : 'Block Loan Application'}
        </button>
      </div>
    </div>
  );
}

// ── Main Page Component ──
export default function LoanMonitoring({ showToast }) {
  const [loans, setLoans] = useState(INITIAL_LOANS);
  const [searchQuery, setSearchQuery] = useState('');
  const [eligibilityFilter, setEligibilityFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('All Users');
  const [selectedUser, setSelectedUser] = useState(null);

  // Stats logic
  const totalEligible = loans.filter(l => l.eligibility === 'Eligible').length;
  const waitingUsers = loans.filter(l => l.eligibility.includes('Days Left')).length;
  const activeLoans = loans.filter(l => l.loanStatus === 'Active' || l.loanStatus === 'Applied').length;

  const filteredLoans = useMemo(() => {
    return loans.filter(l => {
      const q = searchQuery.toLowerCase();
      const matchSearch = l.userName.toLowerCase().includes(q) || l.mobile.includes(q);
      const matchEligibleFilter = eligibilityFilter === 'All' || l.eligibility === eligibilityFilter;
      
      let matchTab = true;
      if (activeTab === 'Eligible') matchTab = l.eligibility === 'Eligible';
      else if (activeTab === 'Waiting Period') matchTab = l.eligibility.includes('Days Left');
      else if (activeTab === 'Loan Active') matchTab = l.loanStatus === 'Active';
      else if (activeTab === 'Blocked') matchTab = l.loanStatus === 'Blocked';

      return matchSearch && matchEligibleFilter && matchTab;
    });
  }, [loans, searchQuery, eligibilityFilter, activeTab]);

  const handleBlockToggle = (user) => {
    const nextStatus = user.loanStatus === 'Blocked' ? 'No Loan' : 'Blocked';
    setLoans(prev => prev.map(l => l.id === user.id ? { ...l, loanStatus: nextStatus } : l));
    if (selectedUser?.id === user.id) {
      setSelectedUser(prev => ({ ...prev, loanStatus: nextStatus }));
    }
    showToast(`${user.userName}'s loan application has been ${nextStatus === 'Blocked' ? 'blocked' : 'unblocked'}.`, nextStatus === 'Blocked' ? 'error' : 'success');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 bg-[#F5F7FA] font-sans">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="font-display font-bold text-[22px] text-[#1C1C1E] m-0">Loan Monitoring</h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-60">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search user, mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-[#1C1C1E] placeholder-[#6B7280] focus:ring-2 focus:ring-[#1A73E8]/20 focus:outline-none"
            />
          </div>

          {/* Eligibility Filter */}
          <select
            value={eligibilityFilter}
            onChange={(e) => setEligibilityFilter(e.target.value)}
            className="text-xs bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#1C1C1E] focus:ring-2 focus:ring-[#1A73E8]/20 focus:outline-none cursor-pointer"
          >
            <option value="All">All Eligibility</option>
            <option value="Eligible">Eligible</option>
            <option value="Not Eligible">Not Eligible</option>
          </select>

          {/* Export */}
          <button
            onClick={() => showToast('Exported Loan Data to Excel.', 'success')}
            className="border border-[#1A73E8] text-[#1A73E8] hover:bg-[#1A73E8]/5 transition-colors font-semibold px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 focus:outline-none"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MiniStatCard 
          label="Total Eligible Users" 
          value={totalEligible} 
          color="#34A853" 
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
        />
        <MiniStatCard 
          label="Waiting Period Users" 
          value={waitingUsers} 
          color="#FBBC04" 
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <MiniStatCard 
          label="Active Loans" 
          value={activeLoans} 
          color="#1A73E8" 
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5h6M9 9h6M9 5a3 3 0 110 6m0-6H6m3 6H6m3 0l6 6M9 11v1" /></svg>}
        />
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden w-full flex flex-col">
        {/* Tab Bar */}
        <div className="flex px-4 border-b border-[#E5E7EB] bg-white overflow-x-auto shrink-0">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-xs font-bold whitespace-nowrap focus:outline-none transition-all border-b-2 ${
                activeTab === tab 
                  ? 'border-[#1A73E8] text-[#1A73E8]' 
                  : 'border-transparent text-[#6B7280] hover:text-[#1C1C1E]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FA] text-[11px] font-bold text-[#6B7280] uppercase tracking-wider border-b border-[#E5E7EB]">
                <th className="py-3.5 px-5 font-semibold">User Name</th>
                <th className="py-3.5 px-5 font-semibold">Mobile</th>
                <th className="py-3.5 px-5 font-semibold">Card Purchase Date</th>
                <th className="py-3.5 px-5 font-semibold">Days Since Purchase</th>
                <th className="py-3.5 px-5 font-semibold">Eligibility Status</th>
                <th className="py-3.5 px-5 font-semibold">Loan Status</th>
                <th className="py-3.5 px-5 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] text-xs">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <p className="text-sm text-[#6B7280] font-medium">No users match the current criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-[#F8F9FA] transition-colors">
                    <td className="py-3.5 px-5 font-bold text-[#1C1C1E]">{loan.userName}</td>
                    <td className="py-3.5 px-5 text-[#6B7280] font-medium">{loan.mobile}</td>
                    <td className="py-3.5 px-5 text-[#6B7280] font-medium">{loan.purchaseDate}</td>
                    <td className="py-3.5 px-5">
                      <ProgressTracker days={loan.daysSince} />
                    </td>
                    <td className="py-3.5 px-5"><EligibilityBadge status={loan.eligibility} /></td>
                    <td className="py-3.5 px-5"><LoanStatusBadge status={loan.loanStatus} /></td>
                    <td className="py-3.5 px-5 text-center">
                      {/* View Action */}
                      <button
                        onClick={() => setSelectedUser(loan)}
                        className="w-8 h-8 inline-flex items-center justify-center rounded bg-white text-[#1A73E8] hover:bg-[#1A73E8]/10 transition-colors focus:outline-none"
                        title="View Details"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer Overlay */}
      {selectedUser && (
        <>
          <div className="fixed inset-0 bg-black/20 z-30 transition-opacity" onClick={() => setSelectedUser(null)} />
          <LoanDrawer 
            user={selectedUser} 
            onClose={() => setSelectedUser(null)} 
            onBlockToggle={handleBlockToggle}
          />
        </>
      )}
    </div>
  );
}
