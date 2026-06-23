/**
 * AgentDrawer.jsx
 * Right-side detail drawer for a selected agent (opened from the Agents page).
 * Contains:
 *   - Agent profile header (avatar initials, name, city, join date, commission badge)
 *   - Info rows: mobile, email, zone, GST, business type
 *   - Performance stats: total registrations, active users, conversion rate
 *   - Earnings summary: total, pending, paid
 *   - Transaction history table with credit/debit rows
 *   - Commission rate selector dropdown
 *   - Block/Unblock and Approve (for Pending) action buttons
 * Props: agent | onClose | onStatusChange(id, status) | onCommissionChange(id, rate) | showToast
 */
import React, { useState } from 'react';
import Icon from './Icons';

const COMMISSION_RATES = ['5%', '7%', '8%', '10%', '12%'];

function StatBox({ label, value, color }) {
  return (
    <div className="flex-1 bg-white rounded-xl border border-[#E5E4E7] p-3 text-center shadow-sm">
      <p className="text-[18px] font-bold leading-tight" style={{ color }}>{value}</p>
      <p className="text-[10px] text-[#6B7280] font-medium mt-0.5 leading-tight">{label}</p>
    </div>
  );
}

function EarningsBlock({ label, value, bg, text }) {
  return (
    <div className={`flex-1 rounded-xl p-3.5 text-center ${bg}`}>
      <p className={`text-[17px] font-bold leading-tight ${text}`}>{value}</p>
      <p className={`text-[10px] font-semibold mt-0.5 ${text} opacity-80`}>{label}</p>
    </div>
  );
}

export default function AgentDrawer({ agent, onClose, onStatusChange, onCommissionChange, showToast }) {
  const [showCommission, setShowCommission] = useState(false);
  const [newRate, setNewRate] = useState(agent.commission);

  if (!agent) return null;

  const handleApprove = () => {
    onStatusChange(agent.id, 'Active');
    showToast(`Agent ${agent.name} has been approved and set to Active.`, 'success');
  };

  const handleBlock = () => {
    const next = agent.status === 'Blocked' ? 'Active' : 'Blocked';
    onStatusChange(agent.id, next);
    showToast(
      next === 'Blocked'
        ? `Agent ${agent.name} has been blocked.`
        : `Agent ${agent.name} has been unblocked.`,
      next === 'Blocked' ? 'error' : 'success'
    );
  };

  const handleCommissionSave = () => {
    onCommissionChange(agent.id, newRate);
    setShowCommission(false);
    showToast(`Commission for ${agent.name} updated to ${newRate}.`, 'success');
  };

  const statusBg = {
    Active:  'bg-[#34A853]/10 text-[#34A853] border-[#34A853]/20',
    Pending: 'bg-[#FBBC04]/10 text-[#D29E00] border-[#FBBC04]/20',
    Blocked: 'bg-[#EA4335]/10 text-[#EA4335] border-[#EA4335]/20',
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-white border-l border-[#E5E4E7] shadow-2xl flex flex-col animate-slide-in-right font-sans">

      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E5E4E7] bg-[#F8F9FA] flex justify-between items-start">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider block">Field Agent Profile</span>
          <h3 className="font-display font-bold text-lg text-[#1C1C1E] mt-0.5 leading-tight">{agent.name}</h3>
          <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBg[agent.status]}`}>
            {agent.status}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-[#6B7280] hover:text-[#1C1C1E] hover:bg-[#F3F4F6] rounded-full transition-all focus:outline-none mt-0.5"
        >
          <Icon name="close" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {/* Agent Bio */}
        <div className="flex items-center gap-4 pb-5 border-b border-[#F3F4F6]">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#1A73E8] to-[#155cb4] text-white font-bold text-xl flex items-center justify-center shadow-md shrink-0">
            {agent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="space-y-1 text-xs">
            <p className="font-semibold text-[#1C1C1E]">{agent.mobile}</p>
            <p className="text-[#6B7280]">{agent.email}</p>
            <p className="text-[#6B7280]">{agent.city} · Zone {agent.zone}</p>
            <p className="text-[#6B7280]">Commission: <span className="font-bold text-[#1A73E8]">{agent.commission}</span></p>
          </div>
        </div>

        {/* Business Details */}
        <div className="space-y-2">
          <h5 className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">Business Info</h5>
          <div className="bg-[#F8F9FA] rounded-xl border border-[#E5E4E7] p-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
            {[
              { label: 'Agent ID',      value: agent.id },
              { label: 'Join Date',     value: agent.joinDate },
              { label: 'Business Type', value: agent.businessType },
              { label: 'GST Number',    value: agent.gst },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-wide">{label}</p>
                <p className="font-bold text-[#1C1C1E] mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Stats — 3 small boxes */}
        <div className="space-y-2">
          <h5 className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">Performance Stats</h5>
          <div className="flex gap-2.5">
            <StatBox label="Total Registrations" value={agent.totalRegistrations} color="#1A73E8" />
            <StatBox label="Active Users"         value={agent.activeUsers}        color="#34A853" />
            <StatBox label="Conversion Rate"      value={agent.conversionRate}     color="#FBBC04" />
          </div>
        </div>

        {/* Earnings — 3 colored blocks */}
        <div className="space-y-2">
          <h5 className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">Earnings Breakdown</h5>
          <div className="flex gap-2.5">
            <EarningsBlock label="Total Earned" value={agent.earnings.total}   bg="bg-[#1A73E8]/10" text="text-[#1A73E8]" />
            <EarningsBlock label="Pending"      value={agent.earnings.pending} bg="bg-[#FBBC04]/10" text="text-[#D29E00]" />
            <EarningsBlock label="Paid Out"     value={agent.earnings.paid}    bg="bg-[#34A853]/10" text="text-[#34A853]" />
          </div>
        </div>

        {/* Transaction History */}
        <div className="space-y-2">
          <h5 className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">Last 5 Transactions</h5>
          <div className="bg-white rounded-xl border border-[#E5E4E7] divide-y divide-[#F3F4F6] overflow-hidden">
            {agent.transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-4 py-3 hover:bg-[#F8F9FA] transition-colors">
                <div>
                  <p className="text-xs font-semibold text-[#1C1C1E]">{tx.description}</p>
                  <p className="text-[10px] text-[#6B7280] mt-0.5">{tx.date}</p>
                </div>
                <span className={`text-xs font-bold ${tx.type === 'credit' ? 'text-[#34A853]' : 'text-[#EA4335]'}`}>
                  {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Commission Adjustment inline panel */}
        {showCommission && (
          <div className="border border-[#1A73E8]/20 bg-[#1A73E8]/5 rounded-xl p-4 space-y-3 animate-slide-in">
            <span className="text-[11px] font-bold text-[#1A73E8] uppercase tracking-wide block">Adjust Commission Rate</span>
            <div className="flex gap-2 flex-wrap">
              {COMMISSION_RATES.map((rate) => (
                <button
                  key={rate}
                  onClick={() => setNewRate(rate)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all focus:outline-none ${
                    newRate === rate
                      ? 'bg-[#1A73E8] text-white border-[#1A73E8]'
                      : 'bg-white text-[#6B7280] border-[#E5E4E7] hover:border-[#1A73E8] hover:text-[#1A73E8]'
                  }`}
                >
                  {rate}
                </button>
              ))}
            </div>
            <div className="flex gap-2 text-[10px]">
              <button
                onClick={() => setShowCommission(false)}
                className="px-3 py-1.5 border border-gray-200 rounded text-[#6B7280] hover:bg-white focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleCommissionSave}
                className="px-3 py-1.5 bg-[#1A73E8] hover:bg-[#155cb4] text-white font-semibold rounded shadow-sm focus:outline-none"
              >
                Save Rate
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="bg-[#F8F9FA] px-5 py-4 border-t border-[#E5E4E7] space-y-2.5">
        {/* Row 1 */}
        <div className="flex gap-2.5">
          {agent.status === 'Pending' && (
            <button
              onClick={handleApprove}
              className="flex-1 py-2 bg-[#34A853] hover:bg-[#2b8a43] text-white font-bold text-xs rounded-lg transition-colors shadow-sm focus:outline-none flex items-center justify-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Approve Agent
            </button>
          )}
          <button
            onClick={handleBlock}
            className={`flex-1 py-2 font-bold text-xs rounded-lg transition-colors focus:outline-none flex items-center justify-center gap-1.5 border ${
              agent.status === 'Blocked'
                ? 'bg-[#34A853] text-white border-[#34A853] hover:bg-[#2b8a43]'
                : 'border-[#EA4335] text-[#EA4335] hover:bg-[#EA4335]/5'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            {agent.status === 'Blocked' ? 'Unblock Agent' : 'Block Agent'}
          </button>
        </div>
        {/* Row 2 */}
        <button
          onClick={() => setShowCommission(!showCommission)}
          className="w-full py-2 border border-[#1A73E8]/40 hover:bg-[#1A73E8]/5 text-[#1A73E8] font-bold text-xs rounded-lg transition-colors focus:outline-none flex items-center justify-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          {showCommission ? 'Cancel Adjustment' : 'Adjust Commission'}
        </button>
      </div>
    </div>
  );
}
