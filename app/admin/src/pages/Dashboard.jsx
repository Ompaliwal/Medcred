/**
 * Dashboard.jsx — /admin-panel (default tab)
 * Main overview page shown after login.
 * Contains:
 *   - Welcome banner with live status indicator
 *   - Mobile search bar (read-only display — search state owned by Header via App)
 *   - 6 stat cards (Users, Cards, Pending Claims, Agents, Revenue, Verifications)
 *     each navigates to the relevant tab on click
 *   - ClaimsTable with All/Approved/Pending/Rejected filter
 *   - VerificationsList with pending credential items
 *   - VerificationModal for approve/reject actions
 * Props: showToast | searchQuery | pendingVerificationsCount | setPendingVerificationsCount | onNavigate
 */
import React, { useState, useMemo } from 'react';
import StatCard from '../components/StatCard';
import ClaimsTable from '../components/ClaimsTable';
import VerificationsList from '../components/VerificationsList';
import VerificationModal from '../components/VerificationModal';
import Icon from '../components/Icons';

export default function Dashboard({ showToast, searchQuery, pendingVerificationsCount, setPendingVerificationsCount, onNavigate }) {
  const [claimFilter, setClaimFilter] = useState('All');
  const [selectedVerification, setSelectedVerification] = useState(null);

  // Mock datasets for Dashboard
  const [claims] = useState([
    { id: 'MC-9021', name: 'Amit Sharma', type: 'Health Insurance', amount: '₹45,000', status: 'Approved', date: '2026-06-23' },
    { id: 'MC-9022', name: 'Priya Patel', type: 'Accidental Claim', amount: '₹1,20,000', status: 'Pending', date: '2026-06-22' },
    { id: 'MC-9023', name: 'Rajesh Kumar', type: 'Critical Illness', amount: '₹3,50,000', status: 'Approved', date: '2026-06-22' },
    { id: 'MC-9024', name: 'Sneha Reddy', type: 'Dental Care', amount: '₹12,500', status: 'Rejected', date: '2026-06-21' },
    { id: 'MC-9025', name: 'Vikram Singh', type: 'Health Insurance', amount: '₹85,000', status: 'Pending', date: '2026-06-20' },
    { id: 'MC-9026', name: 'Ananya Das', type: 'OPD Consultation', amount: '₹3,200', status: 'Approved', date: '2026-06-20' },
  ]);

  const [verifications, setVerifications] = useState([
    { id: 'V-101', name: 'Dr. Ramesh Mehta', type: 'Medical License', initial: 'RM', regNo: 'MCI-87391', date: '2026-06-23', document: 'medical_license_ramesh.pdf' },
    { id: 'V-102', name: 'Sunita Krishnan', type: 'Hospital Affiliation', initial: 'SK', regNo: 'HOS-22041', date: '2026-06-22', document: 'affiliation_certificate.pdf' },
    { id: 'V-103', name: 'Anil Deshmukh', type: 'Aadhaar Verification', initial: 'AD', regNo: 'AAD-9831-2941', date: '2026-06-22', document: 'aadhaar_front_back.pdf' },
    { id: 'V-104', name: 'Dr. Kavita Rao', type: 'Specialist Board Cert', initial: 'KR', regNo: 'SBC-90412', date: '2026-06-21', document: 'board_certificate_kavita.pdf' },
    { id: 'V-105', name: 'Sanjay Dutt', type: 'Clinic Facility Registry', initial: 'SD', regNo: 'CLN-10294', date: '2026-06-20', document: 'facility_permit.pdf' },
  ]);

  // Sync state verification count with global badge
  React.useEffect(() => {
    setPendingVerificationsCount(verifications.length);
  }, [verifications, setPendingVerificationsCount]);

  const pendingClaimsCount = useMemo(() => claims.filter((c) => c.status === 'Pending').length, [claims]);
  const totalUsersCount = 15420;
  const activeCardsCount = 8945;
  const activeAgentsCount = 384;
  const revenueThisMonth = '₹24,85,600';

  const statCards = [
    { title: 'Total Users', value: totalUsersCount.toLocaleString('en-IN'), label: 'Total active registrations', icon: 'person', color: '#1A73E8', navigateTo: 'users' },
    { title: 'Active Cards', value: activeCardsCount.toLocaleString('en-IN'), label: 'MedCred smartcards active', icon: 'card', color: '#34A853', navigateTo: 'health-cards' },
    { title: 'Pending Claims', value: pendingClaimsCount, label: 'Claims awaiting review', icon: 'file', color: '#FBBC04', navigateTo: 'claims' },
    { title: 'Active Agents', value: activeAgentsCount, label: 'Verified field agents', icon: 'briefcase', color: '#1A73E8', navigateTo: 'agents' },
    { title: 'Revenue This Month', value: revenueThisMonth, label: 'Claims volume processed', icon: 'rupee', color: '#34A853', navigateTo: 'wallet' },
    { title: 'Pending Verifications', value: pendingVerificationsCount, label: 'Awaiting credential checks', icon: 'shield', color: '#EA4335', navigateTo: 'verifications' },
  ];

  // Filters
  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const matchesSearch =
        claim.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = claimFilter === 'All' || claim.status === claimFilter;
      return matchesSearch && matchesFilter;
    });
  }, [claims, searchQuery, claimFilter]);

  const filteredVerifications = useMemo(() => {
    return verifications.filter((v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [verifications, searchQuery]);

  const handleApproveVerification = (id, name) => {
    setVerifications((prev) => prev.filter((v) => v.id !== id));
    showToast(`Verification request for ${name} has been Approved successfully!`, 'success');
    setSelectedVerification(null);
  };

  const handleRejectVerification = (id, name) => {
    setVerifications((prev) => prev.filter((v) => v.id !== id));
    showToast(`Verification request for ${name} has been Rejected.`, 'error');
    setSelectedVerification(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8 w-full">
      {/* Welcome Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-white to-[#F8F9FA] border border-[#E5E4E7] p-5 rounded-xl shadow-sm">
        <div>
          <h2 className="font-display font-bold text-xl text-[#1C1C1E] mb-1">Welcome back, Admin Panel!</h2>
          <p className="text-xs text-[#6B7280]">
            Here is an overview of MedCred India credentials, claims, agents activity, and pending tasks.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34A853] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34A853]"></span>
          </span>
          <span className="text-xs font-semibold text-[#34A853]">Live System Status Active</span>
        </div>
      </div>

      {/* Mobile search bar — read-only display; search state is owned by Header via App */}
      <div className="sm:hidden relative w-full">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280]">
          <Icon name="search" />
        </span>
        <input
          type="text"
          placeholder="Search claims, name, type..."
          value={searchQuery}
          readOnly
          className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#E5E4E7] rounded-lg text-[#1C1C1E] placeholder-[#6B7280] focus:ring-2 focus:ring-[#1A73E8]/20 focus:outline-none"
        />
      </div>

      {/* Stat Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <StatCard
            key={idx}
            title={card.title}
            value={card.value}
            label={card.label}
            icon={card.icon}
            color={card.color}
            onClick={card.navigateTo && onNavigate ? () => onNavigate(card.navigateTo) : undefined}
          />
        ))}
      </section>

      {/* Tables Side by Side */}
      <section className="flex flex-col lg:flex-row gap-8 items-start">
        <ClaimsTable
          claims={filteredClaims}
          claimFilter={claimFilter}
          setClaimFilter={setClaimFilter}
          onShowToast={showToast}
        />

        <VerificationsList
          verifications={filteredVerifications}
          onSelectVerification={setSelectedVerification}
          onShowToast={showToast}
        />
      </section>

      {/* Details Dialog modal */}
      <VerificationModal
        selectedVerification={selectedVerification}
        onClose={() => setSelectedVerification(null)}
        onApprove={handleApproveVerification}
        onReject={handleRejectVerification}
      />
    </div>
  );
}
