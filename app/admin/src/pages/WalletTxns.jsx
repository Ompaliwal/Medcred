/**
 * WalletTxns.jsx — "Wallet & Txns" tab
 * Wallet and transaction monitoring page.
 * Contains: summary stat strip (Total / Credit / Debit / Pending),
 * search + type/status filters, transactions table with ID, user,
 * type badge, amount (green credit / red debit), status, date.
 * Export button (toast only). Props: showToast
 */
import React, { useState, useMemo } from 'react';

const INITIAL_TXNS = [
  {
    id: 'TXN-90201', name: 'Rahul Sharma', type: 'Claim Payout', amount: 15000, 
    date: '23 Jun 2026, 10:30 AM', reference: 'CLM-802', status: 'Completed', isCredit: false
  },
  
  {
    id: 'TXN-90202', name: 'Priya Verma', type: 'Refund', amount: 1200, 
    date: '22 Jun 2026, 04:15 PM', reference: 'REF-114', status: 'Completed', isCredit: true
  },
  {
    id: 'TXN-90203', name: 'Deepak Patel', type: 'Agent Commission', amount: 450, 
    date: '22 Jun 2026, 11:00 AM', reference: 'COM-992', status: 'Pending', isCredit: false
  },
  {
    id: 'TXN-90204', name: 'Sanjay Gupta', type: 'Card Purchase', amount: 499, 
    date: '21 Jun 2026, 02:45 PM', reference: 'ORD-751', status: 'Completed', isCredit: true
  },
  {
    id: 'TXN-90205', name: 'Hospital ABC', type: 'Claim Payout', amount: 45000, 
    date: '21 Jun 2026, 09:10 AM', reference: 'CLM-800', status: 'Failed', isCredit: false
  },
  {
    id: 'TXN-90206', name: 'Anjali Desai', type: 'Agent Commission', amount: 900, 
    date: '20 Jun 2026, 06:20 PM', reference: 'COM-990', status: 'Completed', isCredit: false
  },
  {
    id: 'TXN-90207', name: 'Vikram Singh', type: 'Card Purchase', amount: 1499, 
    date: '20 Jun 2026, 10:05 AM', reference: 'ORD-749', status: 'Completed', isCredit: true
  }
];

const TABS = ['All Transactions', 'Claims', 'Refunds', 'Agent Incentives'];

function StatCard({ label, value, icon, color }) {
  return (
    <div className="flex-1 bg-white rounded-[10px] shadow-sm p-4 flex items-center gap-4 border border-[#E5E7EB]">
      <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}1A`, color: color }}>
        {icon}
      </div>
      <div>
        <p className="text-xl sm:text-2xl font-bold text-[#1C1C1E] leading-tight">{value}</p>
        <p className="text-xs text-[#6B7280] font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function TypeTag({ type }) {
  const map = {
    'Claim Payout': 'bg-[#EEF4FD] text-[#1A73E8]',
    'Refund': 'bg-[#E6F4EA] text-[#34A853]',
    'Agent Commission': 'bg-[#F3EEFF] text-[#7C3AED]',
    'Card Purchase': 'bg-[#FEF7E0] text-[#E65100]', // using deeper orange text
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${map[type] || 'bg-gray-100 text-gray-600'}`}>
      {type}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    'Completed': 'bg-[#E6F4EA] text-[#34A853]',
    'Pending': 'bg-[#FEF7E0] text-[#F9A825]',
    'Failed': 'bg-[#FCE8E6] text-[#EA4335]',
  };
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${map[status] || 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  );
}

export default function WalletTxns({ showToast }) {
  const [txns] = useState(INITIAL_TXNS);
  const [activeTab, setActiveTab] = useState('All Transactions');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredTxns = useMemo(() => {
    return txns.filter(t => {
      // Tab filter
      let matchTab = true;
      if (activeTab === 'Claims') matchTab = t.type === 'Claim Payout';
      else if (activeTab === 'Refunds') matchTab = t.type === 'Refund';
      else if (activeTab === 'Agent Incentives') matchTab = t.type === 'Agent Commission';

      // Dropdown filter
      const matchType = typeFilter === 'All' || t.type === typeFilter;

      return matchTab && matchType;
    });
  }, [txns, activeTab, typeFilter]);

  // Icons
  const rupeeIcon = <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5h6M9 9h6M9 5a3 3 0 110 6m0-6H6m3 6H6m3 0l6 6M9 11v1" /></svg>;
  const refreshIcon = <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
  const briefcaseIcon = <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 022 2z" /></svg>;
  const trendingUpIcon = <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 bg-[#F5F7FA] font-sans">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="font-display font-bold text-[22px] text-[#1C1C1E] m-0">Wallet & Txns</h2>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Date Picker (Mock) */}
          <div className="flex items-center bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#1A73E8]/20">
            <span className="text-xs text-[#6B7280] mr-2">From</span>
            <input type="date" className="text-xs text-[#1C1C1E] bg-transparent outline-none w-24" defaultValue="2026-06-01" />
            <span className="text-xs text-[#6B7280] mx-2">→ To</span>
            <input type="date" className="text-xs text-[#1C1C1E] bg-transparent outline-none w-24" defaultValue="2026-06-30" />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#1C1C1E] focus:ring-2 focus:ring-[#1A73E8]/20 focus:outline-none cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Claim Payout">Claim Payout</option>
            <option value="Refund">Refund</option>
            <option value="Agent Commission">Agent Commission</option>
            <option value="Card Purchase">Card Purchase</option>
          </select>

          {/* Export */}
          <button
            onClick={() => showToast('Transactions exported successfully.', 'success')}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Claims Paid" value="₹12,45,000" icon={rupeeIcon} color="#1A73E8" />
        <StatCard label="Total Refunds" value="₹8,500" icon={refreshIcon} color="#34A853" />
        <StatCard label="Agent Incentives Paid" value="₹45,200" icon={briefcaseIcon} color="#7C3AED" />
        <StatCard label="Platform Revenue" value="₹1,25,400" icon={trendingUpIcon} color="#34A853" />
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
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FA] text-[11px] font-bold text-[#6B7280] uppercase tracking-wider border-b border-[#E5E7EB]">
                <th className="py-3.5 px-5 font-semibold">Txn ID</th>
                <th className="py-3.5 px-5 font-semibold">Name</th>
                <th className="py-3.5 px-5 font-semibold">Type</th>
                <th className="py-3.5 px-5 font-semibold text-right">Amount</th>
                <th className="py-3.5 px-5 font-semibold">Date & Time</th>
                <th className="py-3.5 px-5 font-semibold">Reference</th>
                <th className="py-3.5 px-5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-xs">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <p className="text-sm text-[#6B7280] font-medium">No transactions found.</p>
                  </td>
                </tr>
              ) : (
                filteredTxns.map((txn) => (
                  <tr key={txn.id} className="hover:bg-[#F5F7FA] transition-colors">
                    <td className="py-3.5 px-5 font-mono font-semibold text-[#1C1C1E]">{txn.id}</td>
                    <td className="py-3.5 px-5 font-bold text-[#1C1C1E]">{txn.name}</td>
                    <td className="py-3.5 px-5"><TypeTag type={txn.type} /></td>
                    <td className="py-3.5 px-5 text-right font-bold">
                      {txn.isCredit ? (
                        <span className="text-[#34A853]">+₹{txn.amount.toLocaleString()}</span>
                      ) : (
                        <span className="text-[#EA4335]">-₹{txn.amount.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-[#6B7280] font-medium">{txn.date}</td>
                    <td className="py-3.5 px-5 text-[#1C1C1E] font-medium">{txn.reference}</td>
                    <td className="py-3.5 px-5"><StatusBadge status={txn.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-[#E5E7EB] bg-white flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-xs text-[#6B7280] font-medium">Showing 1-10 of 248 records</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 text-xs font-medium text-[#6B7280] hover:bg-[#F5F7FA] rounded transition-colors focus:outline-none">Prev</button>
            <button className="w-7 h-7 flex items-center justify-center text-xs font-bold rounded bg-[#1A73E8] text-white focus:outline-none">1</button>
            <button className="w-7 h-7 flex items-center justify-center text-xs font-medium text-[#6B7280] hover:bg-[#F5F7FA] rounded transition-colors focus:outline-none">2</button>
            <button className="w-7 h-7 flex items-center justify-center text-xs font-medium text-[#6B7280] hover:bg-[#F5F7FA] rounded transition-colors focus:outline-none">3</button>
            <span className="text-xs text-[#6B7280] px-1">...</span>
            <button className="px-2.5 py-1 text-xs font-medium text-[#6B7280] hover:bg-[#F5F7FA] rounded transition-colors focus:outline-none">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
