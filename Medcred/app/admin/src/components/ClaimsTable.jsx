/**
 * ClaimsTable.jsx
 * Claims list table used on the Dashboard page.
 * Shows: Claim ID, patient name, type, amount, status badge, date.
 * Filter tabs: All | Approved | Pending | Rejected
 * Row click → shows toast with claim details.
 * Props: claims (filtered array) | claimFilter | setClaimFilter | onShowToast
 */
import React from 'react';

export default function ClaimsTable({
  claims,
  claimFilter,
  setClaimFilter,
  onShowToast,
}) {
  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-[#34A853]/10 text-[#34A853] border-[#34A853]/20';
      case 'Pending':
        return 'bg-[#FBBC04]/10 text-[#D29E00] border-[#FBBC04]/20';
      case 'Rejected':
        return 'bg-[#EA4335]/10 text-[#EA4335] border-[#EA4335]/20';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleRowClick = (claimId) => {
    if (onShowToast) {
      onShowToast(`Selected claim details: ${claimId}`, 'success');
    }
  };

  return (
    <div className="w-full lg:w-3/5 bg-white rounded-xl shadow-sm border border-[#E5E4E7] overflow-hidden flex flex-col">
      {/* Title & Filter Tabs */}
      <div className="p-5 border-b border-[#E5E4E7] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-display font-bold text-base text-[#1C1C1E]">Recent Claims</h3>
          <p className="text-xs text-[#6B7280] mt-0.5">Summary of claims submitted by cardholders</p>
        </div>

        <div className="flex bg-[#F3F4F6] p-0.5 rounded-lg text-xs font-medium">
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setClaimFilter(status)}
              className={`px-3 py-1 rounded-md transition-all focus:outline-none ${
                claimFilter === status
                  ? 'bg-white text-[#1C1C1E] shadow-sm font-semibold'
                  : 'text-[#6B7280] hover:text-[#1C1C1E]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Table wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8F9FA] text-[11px] font-bold text-[#6B7280] uppercase tracking-wider border-b border-[#E5E4E7]">
              <th className="py-3 px-5 font-semibold">Claim ID</th>
              <th className="py-3 px-5 font-semibold">User Name</th>
              <th className="py-3 px-5 font-semibold">Type</th>
              <th className="py-3 px-5 font-semibold">Amount</th>
              <th className="py-3 px-5 font-semibold">Status</th>
              <th className="py-3 px-5 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6] text-xs">
            {claims.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-sm text-[#6B7280]">
                  No claims match your criteria.
                </td>
              </tr>
            ) : (
              claims.map((claim) => (
                <tr
                  key={claim.id}
                  className="hover:bg-[#1A73E8]/5 transition-colors cursor-pointer group"
                  onClick={() => handleRowClick(claim.id)}
                >
                  <td className="py-3.5 px-5 font-semibold text-[#1A73E8] group-hover:underline">
                    {claim.id}
                  </td>
                  <td className="py-3.5 px-5 font-medium text-[#1C1C1E]">
                    {claim.name}
                  </td>
                  <td className="py-3.5 px-5 text-[#6B7280] font-medium">
                    {claim.type}
                  </td>
                  <td className="py-3.5 px-5 font-bold text-[#1C1C1E]">
                    {claim.amount}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle(claim.status)}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-[#6B7280] font-medium whitespace-nowrap">
                    {claim.date}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer link */}
      <div className="p-4 border-t border-[#E5E4E7] flex justify-between items-center text-xs bg-[#F8F9FA] text-[#6B7280]">
        <span>Showing {claims.length} claims</span>
        <button
          onClick={() => onShowToast && onShowToast('Full claims data loaded', 'success')}
          className="text-xs font-semibold text-[#1A73E8] hover:underline focus:outline-none"
        >
          View All Claims &rarr;
        </button>
      </div>
    </div>
  );
}
