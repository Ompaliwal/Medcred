/**
 * HealthCards.jsx — "Health Cards" tab
 * Manages MedCred physical and digital health cards.
 * Contains:
 *   - Search bar + status filter + Export button
 *   - 3 summary stat cards (Total / Active / Expiring This Month)
 *   - Cards table with ID, user, mobile, plan type, issue/expiry dates, status
 *   - View button → opens CardDrawer (right-side detail drawer) with:
 *       card visual preview, card info, linked user details, suspend/renew actions
 *   - Suspend/Reactivate toggle button per row
 * Props: showToast
 */
import React, { useState, useMemo } from 'react';

const INITIAL_CARDS = [
  {
    id: 'MC-2401', userName: 'Rahul Sharma', mobile: '9876543210', planType: 'Individual',
    issueDate: '01 Jan 2026', expiryDate: '31 Dec 2026', status: 'Active',
    email: 'rahul.s@example.com', kycStatus: 'Verified'
  },
  {
    id: 'MC-2402', userName: 'Priya Verma', mobile: '9123456789', planType: 'Family',
    issueDate: '15 Mar 2025', expiryDate: '14 Mar 2026', status: 'Expiring Soon', // will map to Active or just mock as Expired
    email: 'priya.v@example.com', kycStatus: 'Verified'
  },
  {
    id: 'MC-2403', userName: 'Sanjay Gupta', mobile: '9811223344', planType: 'Individual',
    issueDate: '10 Feb 2024', expiryDate: '09 Feb 2025', status: 'Expired',
    email: 'sanjay.g@example.com', kycStatus: 'Pending'
  },
  {
    id: 'MC-2404', userName: 'Anjali Desai', mobile: '9988776655', planType: 'Family',
    issueDate: '22 May 2026', expiryDate: '21 May 2027', status: 'Suspended',
    email: 'anjali.d@example.com', kycStatus: 'Verified'
  },
  {
    id: 'MC-2405', userName: 'Vikram Singh', mobile: '9900112233', planType: 'Individual',
    issueDate: '05 Jun 2026', expiryDate: '04 Jun 2027', status: 'Pending',
    email: 'vikram.s@example.com', kycStatus: 'Pending'
  }
];

function PlanPill({ type }) {
  if (type === 'Family') {
    return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#F3EEFF] text-[#7C3AED]">{type}</span>;
  }
  return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EEF4FD] text-[#1A73E8]">{type}</span>;
}

function StatusBadge({ status }) {
  const map = {
    Active: 'bg-[#E6F4EA] text-[#34A853]',
    'Expiring Soon': 'bg-[#E6F4EA] text-[#34A853]', // Treating as Active visually here, or could be distinct
    Expired: 'bg-[#F1F3F4] text-[#6B7280]',
    Suspended: 'bg-[#FCE8E6] text-[#EA4335]',
    Pending: 'bg-[#FEF7E0] text-[#F9A825]',
  };
  const actualStatus = status === 'Expiring Soon' ? 'Active' : status;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${map[status] || 'bg-gray-100 text-gray-500'}`}>
      {actualStatus}
    </span>
  );
}

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

// ── Right Drawer Component ──
function CardDrawer({ card, onClose, onSuspend, onRenew }) {
  if (!card) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-[400px] bg-white border-l border-[#E5E7EB] shadow-2xl flex flex-col animate-slide-in-right font-sans">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E5E7EB] flex justify-between items-center bg-white shrink-0">
        <h3 className="font-display font-bold text-lg text-[#1C1C1E]">Card Details</h3>
        <button onClick={onClose} className="p-1.5 text-[#6B7280] hover:text-[#1C1C1E] hover:bg-[#F3F4F6] rounded-full transition-all focus:outline-none">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Section 1: Visual Card Preview */}
        <div>
          <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-3">Card Preview</h4>
          <div className="relative w-full aspect-[1.586/1] rounded-[16px] bg-gradient-to-br from-[#1A73E8] to-[#1557B0] p-5 flex flex-col justify-between text-white shadow-lg overflow-hidden">
            {/* Background pattern placeholder */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_#ffffff_0%,_transparent_40%)]"></div>
            
            {/* Top row */}
            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-white flex items-center justify-center text-[#1A73E8] font-bold text-xs shadow-sm">M</div>
                <span className="font-bold text-sm tracking-tight">MedCred India</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
                {card.planType}
              </span>
            </div>

            {/* Middle row */}
            <div className="relative z-10 text-center mt-2">
              <p className="font-mono text-2xl font-bold tracking-widest drop-shadow-md">{card.id}</p>
            </div>

            {/* Bottom row */}
            <div className="flex justify-between items-end relative z-10">
              <div>
                <p className="text-[10px] text-white/70 uppercase font-semibold mb-0.5">Cardholder</p>
                <p className="font-bold text-sm truncate max-w-[150px] drop-shadow-sm">{card.userName}</p>
                <p className="text-[10px] text-white/90 mt-1">Valid Till: {card.expiryDate}</p>
              </div>
              {/* QR Code Placeholder */}
              <div className="w-[50px] h-[50px] bg-white rounded flex items-center justify-center p-1 shadow-sm">
                <div className="w-full h-full border-2 border-dashed border-[#1A73E8]/30 flex items-center justify-center">
                  <span className="text-[8px] text-[#1A73E8] font-bold text-center leading-none">QR<br/>CODE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Card Details */}
        <div>
          <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-3">Card Information</h4>
          <div className="bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] p-4 grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
            <div>
              <p className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-wide">Plan Type</p>
              <p className="font-bold text-[#1C1C1E] mt-0.5">{card.planType}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-wide">Issue Date</p>
              <p className="font-semibold text-[#1C1C1E] mt-0.5">{card.issueDate}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-wide">Expiry Date</p>
              <p className="font-semibold text-[#1C1C1E] mt-0.5">{card.expiryDate}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-wide">Card Status</p>
              <div className="mt-0.5"><StatusBadge status={card.status} /></div>
            </div>
          </div>
        </div>

        {/* Section 3: Linked User */}
        <div>
          <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-3">Linked User</h4>
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-[#1C1C1E] text-base">{card.userName}</p>
                <p className="text-xs text-[#6B7280]">{card.mobile}</p>
                <p className="text-xs text-[#6B7280]">{card.email}</p>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                card.kycStatus === 'Verified' ? 'bg-[#34A853]/10 text-[#34A853] border-[#34A853]/20' : 'bg-[#FBBC04]/10 text-[#D29E00] border-[#FBBC04]/20'
              }`}>
                KYC {card.kycStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 border-t border-[#E5E7EB] bg-[#F8F9FA] flex gap-3 shrink-0">
        <button
          onClick={() => onSuspend(card)}
          className="flex-1 py-2.5 border border-[#EA4335] text-[#EA4335] hover:bg-[#EA4335]/5 font-bold text-xs rounded-lg transition-colors focus:outline-none"
        >
          {card.status === 'Suspended' ? 'Reactivate Card' : 'Suspend Card'}
        </button>
        <button
          onClick={() => onRenew(card)}
          className="flex-1 py-2.5 bg-[#1A73E8] hover:bg-[#155cb4] text-white font-bold text-xs rounded-lg shadow-sm transition-colors focus:outline-none"
        >
          Renew Card
        </button>
      </div>
    </div>
  );
}


// ── Main Page Component ──
export default function HealthCards({ showToast }) {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCard, setSelectedCard] = useState(null);

  const filteredCards = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return cards.filter(c => {
      const matchSearch = c.userName.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.mobile.includes(q);
      const s = c.status === 'Expiring Soon' ? 'Active' : c.status;
      const matchStatus = statusFilter === 'All' || s === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [cards, searchQuery, statusFilter]);

  const totalCards = cards.length;
  const activeCards = cards.filter(c => c.status === 'Active' || c.status === 'Expiring Soon').length;
  const expiringCards = cards.filter(c => c.status === 'Expiring Soon' || c.expiryDate.includes('2025')).length; // Mock logic

  const handleSuspend = (card) => {
    const next = card.status === 'Suspended' ? 'Active' : 'Suspended';
    setCards(prev => prev.map(c => c.id === card.id ? { ...c, status: next } : c));
    if (selectedCard?.id === card.id) {
      setSelectedCard(prev => ({ ...prev, status: next }));
    }
    showToast(`Card ${card.id} has been ${next === 'Suspended' ? 'suspended' : 'reactivated'}.`, next === 'Suspended' ? 'error' : 'success');
  };

  const handleRenew = (card) => {
    showToast(`Renewal process started for ${card.id}`, 'success');
    // Mock renew logic
    setCards(prev => prev.map(c => c.id === card.id ? { ...c, status: 'Active' } : c));
    if (selectedCard?.id === card.id) {
      setSelectedCard(prev => ({ ...prev, status: 'Active' }));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 bg-[#F5F7FA] font-sans">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display font-bold text-[22px] text-[#1C1C1E] m-0">Health Cards</h2>
          <p className="text-xs text-[#6B7280] mt-1">Manage physical and digital MedCred cards.</p>
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
              placeholder="Search user, mobile, or Card ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-[#1C1C1E] placeholder-[#6B7280] focus:ring-2 focus:ring-[#1A73E8]/20 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#1C1C1E] focus:ring-2 focus:ring-[#1A73E8]/20 focus:outline-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Suspended">Suspended</option>
            <option value="Pending">Pending</option>
          </select>

          {/* Export */}
          <button
            onClick={() => showToast('Cards exported to CSV.', 'success')}
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
          label="Total Cards" 
          value={totalCards} 
          color="#1A73E8" 
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
        />
        <MiniStatCard 
          label="Active Cards" 
          value={activeCards} 
          color="#34A853" 
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <MiniStatCard 
          label="Expiring This Month" 
          value={expiringCards} 
          color="#FBBC04" 
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FA] text-[11px] font-bold text-[#6B7280] uppercase tracking-wider border-b border-[#E5E7EB]">
                <th className="py-3.5 px-5 font-semibold">Card ID</th>
                <th className="py-3.5 px-5 font-semibold">User Name</th>
                <th className="py-3.5 px-5 font-semibold">Mobile</th>
                <th className="py-3.5 px-5 font-semibold">Plan Type</th>
                <th className="py-3.5 px-5 font-semibold">Issue Date</th>
                <th className="py-3.5 px-5 font-semibold">Expiry Date</th>
                <th className="py-3.5 px-5 font-semibold">Status</th>
                <th className="py-3.5 px-5 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] text-xs">
              {filteredCards.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-16 text-center">
                    <p className="text-sm text-[#6B7280] font-medium">No cards match the selected filters.</p>
                  </td>
                </tr>
              ) : (
                filteredCards.map((card) => (
                  <tr key={card.id} className="hover:bg-[#F8F9FA] transition-colors">
                    <td className="py-3.5 px-5 font-mono font-semibold text-[#1C1C1E]">{card.id}</td>
                    <td className="py-3.5 px-5 font-bold text-[#1C1C1E]">{card.userName}</td>
                    <td className="py-3.5 px-5 text-[#6B7280] font-medium">{card.mobile}</td>
                    <td className="py-3.5 px-5"><PlanPill type={card.planType} /></td>
                    <td className="py-3.5 px-5 text-[#6B7280] font-medium">{card.issueDate}</td>
                    <td className="py-3.5 px-5 text-[#6B7280] font-medium">{card.expiryDate}</td>
                    <td className="py-3.5 px-5"><StatusBadge status={card.status} /></td>
                    <td className="py-3.5 px-5 text-center">
                      <div className="flex justify-center gap-2">
                        {/* Eye Icon (View) */}
                        <button
                          onClick={() => setSelectedCard(card)}
                          className="w-8 h-8 flex items-center justify-center rounded bg-white text-[#1A73E8] hover:bg-[#1A73E8]/10 transition-colors focus:outline-none"
                          title="View Details"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {/* Block Icon (Suspend) */}
                        <button
                          onClick={() => handleSuspend(card)}
                          className={`w-8 h-8 flex items-center justify-center rounded bg-white transition-colors focus:outline-none ${
                            card.status === 'Suspended' ? 'text-[#34A853] hover:bg-[#34A853]/10' : 'text-[#EA4335] hover:bg-[#EA4335]/10'
                          }`}
                          title={card.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
                        >
                          {card.status === 'Suspended' ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer Overlay */}
      {selectedCard && (
        <>
          <div className="fixed inset-0 bg-black/20 z-30 transition-opacity" onClick={() => setSelectedCard(null)} />
          <CardDrawer 
            card={selectedCard} 
            onClose={() => setSelectedCard(null)} 
            onSuspend={handleSuspend}
            onRenew={handleRenew}
          />
        </>
      )}
    </div>
  );
}
