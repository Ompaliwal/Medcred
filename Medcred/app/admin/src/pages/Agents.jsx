/**
 * Agents.jsx — "Agents" tab
 * Full agents management page.
 * Contains:
 *   - Search bar + status filter (All / Active / Pending / Blocked)
 *   - "Add Agent" button (shows toast — form not yet implemented)
 *   - Summary stat strip (Total / Active / Pending / Blocked counts)
 *   - Agents table with ID, name, city, mobile, registrations, active users, earnings, status
 *   - View button → opens AgentDrawer (right-side detail drawer)
 *   - Block/Unblock toggle button per row
 * Props: showToast
 */
import React, { useState, useMemo } from 'react';
import AgentDrawer from '../components/AgentDrawer';

const INITIAL_AGENTS = [
  {
    id: 'AGT-001', name: 'Deepak Verma',     mobile: '9876501234', email: 'deepak.v@medcred.in',
    city: 'Mumbai',    zone: 'West',  businessType: 'Individual',  gst: 'GSTMH2301A',
    joinDate: '2025-09-12', commission: '8%', status: 'Active',
    totalRegistrations: 142, activeUsers: 118, conversionRate: '83%',
    earnings: { total: '₹71,000', pending: '₹12,400', paid: '₹58,600' },
    transactions: [
      { id: 't1', description: 'Registration payout – May', date: '2026-05-31', amount: '₹14,200', type: 'credit' },
      { id: 't2', description: 'Commission – April',        date: '2026-04-30', amount: '₹13,800', type: 'credit' },
      { id: 't3', description: 'Clawback adjustment',       date: '2026-04-15', amount: '₹1,200',  type: 'debit'  },
      { id: 't4', description: 'Commission – March',        date: '2026-03-31', amount: '₹15,600', type: 'credit' },
      { id: 't5', description: 'Commission – February',     date: '2026-02-28', amount: '₹14,000', type: 'credit' },
    ],
  },
  {
    id: 'AGT-002', name: 'Kavitha Rajan',    mobile: '9812344321', email: 'kavitha.r@medcred.in',
    city: 'Chennai',   zone: 'South', businessType: 'Partnership',  gst: 'GSTNL2202B',
    joinDate: '2025-11-05', commission: '7%', status: 'Pending',
    totalRegistrations: 28, activeUsers: 20, conversionRate: '71%',
    earnings: { total: '₹9,800', pending: '₹9,800', paid: '₹0' },
    transactions: [
      { id: 't1', description: 'Registration payout – June', date: '2026-06-10', amount: '₹5,600', type: 'credit' },
      { id: 't2', description: 'Registration payout – May',  date: '2026-05-25', amount: '₹4,200', type: 'credit' },
    ],
  },
  {
    id: 'AGT-003', name: 'Suresh Nair',      mobile: '9944332211', email: 'suresh.n@medcred.in',
    city: 'Kochi',     zone: 'South', businessType: 'Individual',  gst: 'GSTKL2303C',
    joinDate: '2025-08-20', commission: '10%', status: 'Active',
    totalRegistrations: 205, activeUsers: 190, conversionRate: '93%',
    earnings: { total: '₹1,02,500', pending: '₹18,000', paid: '₹84,500' },
    transactions: [
      { id: 't1', description: 'Commission – June',     date: '2026-06-30', amount: '₹18,000', type: 'credit' },
      { id: 't2', description: 'Commission – May',      date: '2026-05-31', amount: '₹19,500', type: 'credit' },
      { id: 't3', description: 'Commission – April',    date: '2026-04-30', amount: '₹17,800', type: 'credit' },
      { id: 't4', description: 'Clawback – March',      date: '2026-03-20', amount: '₹2,100',  type: 'debit'  },
      { id: 't5', description: 'Commission – February', date: '2026-02-28', amount: '₹16,900', type: 'credit' },
    ],
  },
  {
    id: 'AGT-004', name: 'Meera Pillai',     mobile: '9833221100', email: 'meera.p@medcred.in',
    city: 'Pune',      zone: 'West',  businessType: 'Corporate',   gst: 'GSTMH2404D',
    joinDate: '2026-01-14', commission: '5%', status: 'Blocked',
    totalRegistrations: 54, activeUsers: 12, conversionRate: '22%',
    earnings: { total: '₹13,500', pending: '₹0', paid: '₹13,500' },
    transactions: [
      { id: 't1', description: 'Commission – March', date: '2026-03-31', amount: '₹6,750', type: 'credit' },
      { id: 't2', description: 'Commission – Feb',   date: '2026-02-28', amount: '₹6,750', type: 'credit' },
    ],
  },
  {
    id: 'AGT-005', name: 'Arjun Menon',      mobile: '9761234500', email: 'arjun.m@medcred.in',
    city: 'Bangalore', zone: 'South', businessType: 'Individual',  gst: 'GSTKN2505E',
    joinDate: '2025-10-30', commission: '8%', status: 'Active',
    totalRegistrations: 178, activeUsers: 155, conversionRate: '87%',
    earnings: { total: '₹89,000', pending: '₹14,200', paid: '₹74,800' },
    transactions: [
      { id: 't1', description: 'Commission – June',     date: '2026-06-30', amount: '₹14,200', type: 'credit' },
      { id: 't2', description: 'Commission – May',      date: '2026-05-31', amount: '₹15,600', type: 'credit' },
      { id: 't3', description: 'Commission – April',    date: '2026-04-30', amount: '₹14,800', type: 'credit' },
      { id: 't4', description: 'Commission – March',    date: '2026-03-31', amount: '₹13,900', type: 'credit' },
      { id: 't5', description: 'Clawback – February',  date: '2026-02-20', amount: '₹1,500',  type: 'debit'  },
    ],
  },
];

function StatusBadge({ status }) {
  const map = {
    Active:  'bg-[#34A853]/10 text-[#34A853] border-[#34A853]/20',
    Pending: 'bg-[#FBBC04]/10 text-[#D29E00] border-[#FBBC04]/20',
    Blocked: 'bg-[#EA4335]/10 text-[#EA4335] border-[#EA4335]/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${map[status] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
      {status}
    </span>
  );
}

export default function Agents({ showToast }) {
  const [agents, setAgents]             = useState(INITIAL_AGENTS);
  const [searchQuery, setSearchQuery]   = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Filter
  const filteredAgents = useMemo(() => {
    return agents.filter((a) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        a.name.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.mobile.includes(q) ||
        a.city.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || a.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [agents, searchQuery, statusFilter]);

  const handleStatusChange = (agentId, newStatus) => {
    setAgents((prev) => prev.map((a) => a.id === agentId ? { ...a, status: newStatus } : a));
    setSelectedAgent((prev) => prev?.id === agentId ? { ...prev, status: newStatus } : prev);
  };

  const handleCommissionChange = (agentId, newRate) => {
    setAgents((prev) => prev.map((a) => a.id === agentId ? { ...a, commission: newRate } : a));
    setSelectedAgent((prev) => prev?.id === agentId ? { ...prev, commission: newRate } : prev);
  };

  const handleBlockToggle = (agent) => {
    const next = agent.status === 'Blocked' ? 'Active' : 'Blocked';
    handleStatusChange(agent.id, next);
    showToast(
      next === 'Blocked'
        ? `Agent ${agent.name} has been blocked.`
        : `Agent ${agent.name} has been unblocked.`,
      next === 'Blocked' ? 'error' : 'success'
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">

      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display font-bold text-[22px] text-[#1C1C1E] m-0">Agents</h2>
          <p className="text-xs text-[#6B7280] mt-1">Manage MedCred field agents, commissions, and performance.</p>
        </div>

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
              placeholder="Search agent name, ID, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-[#E5E4E7] rounded-lg text-[#1C1C1E] placeholder-[#6B7280] focus:ring-2 focus:ring-[#1A73E8]/20 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-[#E5E4E7] rounded-lg px-3 py-1.5 text-[#1C1C1E] focus:ring-2 focus:ring-[#1A73E8]/20 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Blocked">Blocked</option>
          </select>

          {/* Add Agent */}
          <button
            onClick={() => {
              showToast('Add Agent form coming soon.', 'success');
            }}
            className="bg-[#1A73E8] hover:bg-[#155cb4] text-white font-bold px-4 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors focus:outline-none"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Agent
          </button>
        </div>
      </div>

      {/* Summary Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Agents',  value: agents.length,                                       color: '#1A73E8' },
          { label: 'Active',        value: agents.filter(a => a.status === 'Active').length,     color: '#34A853' },
          { label: 'Pending',       value: agents.filter(a => a.status === 'Pending').length,    color: '#D29E00' },
          { label: 'Blocked',       value: agents.filter(a => a.status === 'Blocked').length,    color: '#EA4335' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-[#E5E4E7] p-4 shadow-sm flex items-center gap-3">
            <span className="text-2xl font-bold" style={{ color }}>{value}</span>
            <span className="text-xs text-[#6B7280] font-medium leading-snug">{label}</span>
          </div>
        ))}
      </div>

      {/* Agents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E4E7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FA] text-[11px] font-bold text-[#6B7280] uppercase tracking-wider border-b border-[#E5E4E7]">
                <th className="py-3.5 px-5 font-semibold">Agent ID</th>
                <th className="py-3.5 px-5 font-semibold">Name</th>
                <th className="py-3.5 px-5 font-semibold">Mobile</th>
                <th className="py-3.5 px-5 font-semibold">Registrations</th>
                <th className="py-3.5 px-5 font-semibold">Active Users</th>
                <th className="py-3.5 px-5 font-semibold">Earnings</th>
                <th className="py-3.5 px-5 font-semibold">Status</th>
                <th className="py-3.5 px-5 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] text-xs">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-10 h-10 text-[#E5E4E7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-[#6B7280] font-medium">No agents match the current filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-[#1A73E8]/5 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-semibold text-[#6B7280]">{agent.id}</td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#1A73E8]/10 text-[#1A73E8] text-[10px] font-bold flex items-center justify-center shrink-0">
                          {agent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-[#1C1C1E]">{agent.name}</p>
                          <p className="text-[10px] text-[#6B7280]">{agent.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-[#6B7280] font-medium">{agent.mobile}</td>
                    <td className="py-3.5 px-5 font-bold text-[#1A73E8] text-center">{agent.totalRegistrations}</td>
                    <td className="py-3.5 px-5 font-bold text-[#34A853] text-center">{agent.activeUsers}</td>
                    <td className="py-3.5 px-5 font-bold text-[#1C1C1E]">{agent.earnings.total}</td>
                    <td className="py-3.5 px-5"><StatusBadge status={agent.status} /></td>
                    <td className="py-3.5 px-5">
                      <div className="flex justify-center gap-2">
                        {/* View */}
                        <button
                          onClick={() => setSelectedAgent(agent)}
                          title="View Details"
                          className="p-1.5 bg-[#1A73E8]/10 hover:bg-[#1A73E8]/20 text-[#1A73E8] rounded-lg transition-colors focus:outline-none"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {/* Block / Unblock */}
                        <button
                          onClick={() => handleBlockToggle(agent)}
                          title={agent.status === 'Blocked' ? 'Unblock Agent' : 'Block Agent'}
                          className={`p-1.5 rounded-lg transition-colors focus:outline-none ${
                            agent.status === 'Blocked'
                              ? 'bg-[#34A853]/10 hover:bg-[#34A853]/20 text-[#34A853]'
                              : 'bg-[#EA4335]/10 hover:bg-[#EA4335]/20 text-[#EA4335]'
                          }`}
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
        <div className="p-4 border-t border-[#E5E4E7] bg-[#F8F9FA] flex justify-between items-center text-xs text-[#6B7280]">
          <span>Showing {filteredAgents.length} of {agents.length} agents</span>
        </div>
      </div>

      {/* Agent Drawer */}
      {selectedAgent && (
        <>
          <div className="fixed inset-0 bg-transparent z-30" onClick={() => setSelectedAgent(null)} />
          <AgentDrawer
            agent={selectedAgent}
            onClose={() => setSelectedAgent(null)}
            onStatusChange={handleStatusChange}
            onCommissionChange={handleCommissionChange}
            showToast={showToast}
          />
        </>
      )}
    </div>
  );
}
