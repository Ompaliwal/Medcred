/**
 * Reports.jsx — "Reports" tab
 * Analytics and reporting page with mock chart data.
 * Contains:
 *   - Date range selector (Last 7 / 30 / 90 Days, This Year)
 *   - 4 KPI stat cards (New Users, Claims Processed, Revenue, Active Agents)
 *   - Bar chart — User Registration Trend (SVG, mock data)
 *   - Horizontal bar chart — Claims by Type breakdown (SVG, mock data)
 *   - Export Report button (toast only)
 * Props: showToast
 */
import React, { useState } from 'react';

// Mock Data for User Registration
const MOCK_USERS = [
  { id: 'MC-2401', name: 'Rahul Sharma', mobile: '9876543210', date: '01 Jun 2026', kyc: 'Verified', cardType: 'Individual', status: 'Active' },
  { id: 'MC-2402', name: 'Priya Verma', mobile: '9123456789', date: '02 Jun 2026', kyc: 'Pending', cardType: 'Family', status: 'Pending' },
  { id: 'MC-2403', name: 'Sanjay Gupta', mobile: '9811223344', date: '05 Jun 2026', kyc: 'Verified', cardType: 'Individual', status: 'Active' },
  { id: 'MC-2404', name: 'Anjali Desai', mobile: '9988776655', date: '10 Jun 2026', kyc: 'Rejected', cardType: 'Family', status: 'Suspended' },
  { id: 'MC-2405', name: 'Vikram Singh', mobile: '9900112233', date: '12 Jun 2026', kyc: 'Verified', cardType: 'Individual', status: 'Active' }
];

// Mock Data for Claims
const MOCK_CLAIMS = [
  { id: 'CLM-801', user: 'Rahul Sharma', type: 'Hospital', amount: '₹15,000', date: '15 Jun 2026', status: 'Approved', days: 2 },
  { id: 'CLM-802', user: 'Priya Verma', type: 'Home Treatment', amount: '₹2,500', date: '18 Jun 2026', status: 'Under Review', days: 5 },
  { id: 'CLM-803', user: 'Sanjay Gupta', type: 'Hospital', amount: '₹45,000', date: '20 Jun 2026', status: 'Rejected', days: 1 },
];

function StatusBadge({ status }) {
  const map = {
    'Active': 'bg-[#E6F4EA] text-[#34A853]',
    'Approved': 'bg-[#E6F4EA] text-[#34A853]',
    'Verified': 'bg-[#E6F4EA] text-[#34A853]',
    'Pending': 'bg-[#FEF7E0] text-[#F9A825]',
    'Under Review': 'bg-[#FEF7E0] text-[#F9A825]',
    'Suspended': 'bg-[#FCE8E6] text-[#EA4335]',
    'Rejected': 'bg-[#FCE8E6] text-[#EA4335]',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${map[status] || 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  );
}

function ShortcutCard({ title, desc, icon, color, lastGen, onGenerate, onExport }) {
  return (
    <div className="bg-white rounded-[10px] border border-[#E5E7EB] p-4 flex flex-col justify-between shadow-sm transition-shadow hover:shadow-md">
      <div>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}1A`, color: color }}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-[15px] text-[#1C1C1E] leading-tight">{title}</h3>
            <p className="text-[12px] text-[#6B7280] mt-1 leading-snug">{desc}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
        <span className="text-[11px] text-[#6B7280] font-medium">Last: {lastGen}</span>
        <div className="flex gap-2">
          <button onClick={onExport} className="px-3 py-1.5 border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6] text-xs font-bold rounded">
            Export
          </button>
          <button onClick={onGenerate} className="px-3 py-1.5 bg-[#1A73E8] text-white hover:bg-[#155cb4] text-xs font-bold rounded shadow-sm">
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Reports({ showToast }) {
  const [reportType, setReportType] = useState('User Registration');
  const [dateFrom, setDateFrom] = useState('2026-06-01');
  const [dateTo, setDateTo] = useState('2026-06-23');

  const handleGenerate = (type) => {
    setReportType(type);
    showToast(`Generated ${type} Report`, 'success');
  };

  const handleExport = (format) => {
    showToast(`Exported report as ${format}`, 'success');
  };

  const renderTable = () => {
    if (reportType === 'User Registration') {
      return (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8F9FA] text-[11px] font-bold text-[#6B7280] uppercase tracking-wider border-b border-[#E5E7EB]">
              <th className="py-3 px-4">User ID</th>
              <th className="py-3 px-4">Full Name</th>
              <th className="py-3 px-4">Mobile</th>
              <th className="py-3 px-4">Registered Date</th>
              <th className="py-3 px-4">KYC Status</th>
              <th className="py-3 px-4">Card Type</th>
              <th className="py-3 px-4">Card Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-xs">
            {MOCK_USERS.map(u => (
              <tr key={u.id} className="hover:bg-[#F5F7FA] transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-[#1C1C1E]">{u.id}</td>
                <td className="py-3 px-4 font-bold text-[#1C1C1E]">{u.name}</td>
                <td className="py-3 px-4 text-[#6B7280] font-medium">{u.mobile}</td>
                <td className="py-3 px-4 text-[#6B7280] font-medium">{u.date}</td>
                <td className="py-3 px-4"><StatusBadge status={u.kyc} /></td>
                <td className="py-3 px-4 text-[#6B7280] font-medium">{u.cardType}</td>
                <td className="py-3 px-4"><StatusBadge status={u.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      return (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8F9FA] text-[11px] font-bold text-[#6B7280] uppercase tracking-wider border-b border-[#E5E7EB]">
              <th className="py-3 px-4">Claim ID</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4">Submitted</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Processing Days</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-xs">
            {MOCK_CLAIMS.map(c => (
              <tr key={c.id} className="hover:bg-[#F5F7FA] transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-[#1C1C1E]">{c.id}</td>
                <td className="py-3 px-4 font-bold text-[#1C1C1E]">{c.user}</td>
                <td className="py-3 px-4 text-[#6B7280] font-medium">{c.type}</td>
                <td className="py-3 px-4 text-right font-bold text-[#1C1C1E]">{c.amount}</td>
                <td className="py-3 px-4 text-[#6B7280] font-medium">{c.date}</td>
                <td className="py-3 px-4"><StatusBadge status={c.status} /></td>
                <td className="py-3 px-4 text-center font-bold text-[#1C1C1E]">{c.days}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 bg-[#F5F7FA] font-sans">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <h2 className="font-display font-bold text-[22px] text-[#1C1C1E] m-0">Reports</h2>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E5E7EB] flex flex-wrap items-center gap-3 w-full">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="text-xs bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#1C1C1E] focus:ring-2 focus:ring-[#1A73E8]/20 focus:outline-none cursor-pointer flex-1 min-w-[180px]"
        >
          <option value="User Registration">User Registration Report</option>
          <option value="Claims Summary">Claims Summary Report</option>
          <option value="Agent Performance">Agent Performance Report</option>
          <option value="Revenue">Revenue Report</option>
          <option value="KYC Report">KYC Report</option>
        </select>

        <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg px-3 py-1.5 bg-[#F8F9FA]">
          <span className="text-xs text-[#6B7280] font-medium">From</span>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="text-xs text-[#1C1C1E] bg-transparent outline-none w-[110px]" />
          <span className="text-xs text-[#6B7280] font-medium">To</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="text-xs text-[#1C1C1E] bg-transparent outline-none w-[110px]" />
        </div>

        <button
          onClick={() => handleGenerate(reportType)}
          className="px-4 py-2 bg-[#1A73E8] text-white hover:bg-[#155cb4] font-bold text-xs rounded-lg transition-colors shadow-sm ml-auto"
        >
          Generate Report
        </button>

        <button
          onClick={() => handleExport('PDF')}
          className="px-3 py-2 border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4 text-[#EA4335]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" /></svg>
          Export PDF
        </button>
        
        <button
          onClick={() => handleExport('Excel')}
          className="px-3 py-2 border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4 text-[#34A853]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          Export Excel
        </button>
      </div>

      {/* 4 Shortcut Cards (2x2 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <ShortcutCard
          title="User Registration Report"
          desc="Track new registrations, KYC status, card activations by date range"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>}
          color="#1A73E8"
          lastGen="Today, 10:30 AM"
          onGenerate={() => handleGenerate('User Registration')}
          onExport={() => handleExport('PDF')}
        />
        <ShortcutCard
          title="Claims Summary Report"
          desc="Hospital vs home treatment claims, approval rates, amounts paid"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
          color="#34A853"
          lastGen="Yesterday, 04:15 PM"
          onGenerate={() => handleGenerate('Claims Summary')}
          onExport={() => handleExport('PDF')}
        />
        <ShortcutCard
          title="Agent Performance Report"
          desc="Registrations per agent, conversion rates, incentives earned"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 022 2z" /></svg>}
          color="#7C3AED"
          lastGen="Jun 15, 11:00 AM"
          onGenerate={() => handleGenerate('Agent Performance')}
          onExport={() => handleExport('PDF')}
        />
        <ShortcutCard
          title="Revenue Report"
          desc="Card sales revenue, claim payouts, net platform earnings"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
          color="#E65100"
          lastGen="Jun 01, 09:00 AM"
          onGenerate={() => handleGenerate('Revenue')}
          onExport={() => handleExport('PDF')}
        />
      </div>

      {/* Report Preview Section */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden w-full flex flex-col">
        {/* Header Row */}
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex justify-between items-center bg-white shrink-0">
          <h3 className="font-bold text-sm text-[#1C1C1E]">
            Showing: <span className="text-[#1A73E8]">{reportType} Report</span> &mdash; Jun 1 to Jun 23, 2026
          </h3>
          <span className="text-xs text-[#6B7280] font-medium bg-[#F3F4F6] px-2.5 py-1 rounded-full">
            {reportType === 'User Registration' ? '248 records' : '156 records'}
          </span>
        </div>

        {/* Summary Row */}
        {reportType === 'User Registration' && (
          <div className="px-5 py-2.5 bg-[#F8F9FA] border-b border-[#E5E7EB] flex items-center gap-4 text-xs font-bold text-[#6B7280]">
            <span>Total Users: 248</span>
            <span className="text-gray-300">|</span>
            <span className="text-[#34A853]">Verified: 201</span>
            <span className="text-gray-300">|</span>
            <span className="text-[#F9A825]">Pending: 32</span>
            <span className="text-gray-300">|</span>
            <span className="text-[#EA4335]">Rejected: 15</span>
          </div>
        )}

        {/* Data Table */}
        <div className="overflow-x-auto min-h-[250px]">
          {renderTable()}
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-[#E5E7EB] bg-white flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-xs text-[#6B7280] font-medium">Showing 1-5 of records</span>
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
