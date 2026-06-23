/**
 * Hospitals.jsx — "Hospitals" tab
 * Hospital network management page.
 * Contains: search + city filter + type filter, hospitals table with
 * ID, name, city, type, beds, empanelment status, contact.
 * View/Edit/Block action buttons per row (toasts only — no drawer yet).
 * Props: showToast
 */
import React, { useState, useMemo } from 'react';

const CITIES = ['All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Kochi'];

const INITIAL_HOSPITALS = [
  { id: 'HSP-001', name: 'Apollo Hospitals',          city: 'Mumbai',    address: '26, Near Bandra Station, Bandra West', claimSupported: true,  status: 'Active',   contact: '9900112233', license: 'apollo_license.pdf' },
  { id: 'HSP-002', name: 'Fortis Healthcare',         city: 'Delhi',     address: '7, Sector 44, Gurugram, New Delhi',    claimSupported: true,  status: 'Active',   contact: '9811223344', license: 'fortis_license.pdf' },
  { id: 'HSP-003', name: 'Manipal Hospitals',         city: 'Bangalore', address: '98, HAL Old Airport Road, Kodihalli',  claimSupported: true,  status: 'Pending',  contact: '9876543210', license: 'manipal_license.pdf' },
  { id: 'HSP-004', name: 'Narayana Health City',      city: 'Bangalore', address: '258/A, Bommasandra, Hosur Road',       claimSupported: false, status: 'Active',   contact: '8023456789', license: null },
  { id: 'HSP-005', name: 'KIMS Hospitals',            city: 'Hyderabad', address: '1-8-31/1, Minister Road, Secunderabad',claimSupported: true,  status: 'Inactive', contact: '9912345678', license: 'kims_license.pdf' },
  { id: 'HSP-006', name: 'Amrita Institute',          city: 'Kochi',     address: 'AIMS Ponekkara PO, Ernakulam',         claimSupported: true,  status: 'Active',   contact: '9844332211', license: 'amrita_license.pdf' },
  { id: 'HSP-007', name: 'Jehangir Hospital',         city: 'Pune',      address: '32, Sassoon Road, Camp Area, Pune',   claimSupported: false, status: 'Pending',  contact: '9665544332', license: null },
  { id: 'HSP-008', name: 'Kauvery Hospital',          city: 'Chennai',   address: '199, Luz Church Road, Mylapore',       claimSupported: true,  status: 'Active',   contact: '9941234567', license: 'kauvery_license.pdf' },
  { id: 'HSP-009', name: 'Max Super Speciality',      city: 'Delhi',     address: '1, Press Enclave Marg, Saket',         claimSupported: false, status: 'Inactive', contact: '9810011002', license: null },
];

const EMPTY_FORM = {
  name: '', address: '', city: 'Mumbai', contact: '', claimSupported: false, licenseFile: null,
};

// ── Small reusable atoms ──────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Active:   'bg-[#34A853]/10 text-[#34A853] border-[#34A853]/20',
    Pending:  'bg-[#FBBC04]/10 text-[#D29E00] border-[#FBBC04]/20',
    Inactive: 'bg-gray-100 text-gray-500 border-gray-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${map[status] || ''}`}>
      {status}
    </span>
  );
}

function ClaimTag({ supported }) {
  return supported ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#34A853]/10 text-[#34A853] border border-[#34A853]/20">
      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      Claim Supported
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-400 border border-gray-200">
      No Claims
    </span>
  );
}

// ── Add / Edit Modal ──────────────────────────────────────────────────
function HospitalModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Hospital name is required.';
    if (!form.address.trim()) e.address = 'Address is required.';
    if (!form.contact.trim() || !/^\d{10}$/.test(form.contact))
      e.contact = 'Valid 10-digit mobile number required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 text-xs border rounded-lg bg-white text-[#1C1C1E] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 transition-all ${
      errors[field] ? 'border-[#EA4335]/60 bg-[#EA4335]/5' : 'border-[#E5E4E7]'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E5E4E7] overflow-hidden z-10 animate-scale-up">

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#1A73E8] to-[#155cb4] px-6 py-4 flex justify-between items-center">
          <div>
            <span className="text-[10px] bg-white/20 uppercase font-bold px-2 py-0.5 rounded-full text-white">
              Hospital Registry
            </span>
            <h3 className="font-display font-bold text-base text-white mt-1">
              {initial ? 'Edit Hospital' : 'Add New Hospital'}
            </h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1.5 hover:bg-white/10 rounded-full focus:outline-none transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">

          {/* Hospital Name */}
          <div>
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide block mb-1.5">
              Hospital Name <span className="text-[#EA4335]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Apollo Hospitals"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className={inputClass('name')}
            />
            {errors.name && <p className="text-[10px] text-[#EA4335] mt-1">{errors.name}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide block mb-1.5">
              Address <span className="text-[#EA4335]">*</span>
            </label>
            <textarea
              rows="2"
              placeholder="Full street address..."
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              className={`${inputClass('address')} resize-none`}
            />
            {errors.address && <p className="text-[10px] text-[#EA4335] mt-1">{errors.address}</p>}
          </div>

          {/* City + Contact in a row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide block mb-1.5">City</label>
              <select
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E5E4E7] rounded-lg bg-white text-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 cursor-pointer"
              >
                {CITIES.filter(c => c !== 'All Cities').map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide block mb-1.5">
                Contact Number <span className="text-[#EA4335]">*</span>
              </label>
              <input
                type="tel"
                placeholder="10-digit mobile"
                maxLength={10}
                value={form.contact}
                onChange={(e) => set('contact', e.target.value.replace(/\D/g, ''))}
                className={inputClass('contact')}
              />
              {errors.contact && <p className="text-[10px] text-[#EA4335] mt-1">{errors.contact}</p>}
            </div>
          </div>

          {/* Claim Support Toggle */}
          <div className="flex items-center justify-between bg-[#F8F9FA] border border-[#E5E4E7] rounded-xl px-4 py-3">
            <div>
              <p className="text-xs font-semibold text-[#1C1C1E]">Claim Supported Hospital</p>
              <p className="text-[10px] text-[#6B7280] mt-0.5">Enables claim processing for this hospital</p>
            </div>
            <button
              type="button"
              onClick={() => set('claimSupported', !form.claimSupported)}
              className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none ${
                form.claimSupported ? 'bg-[#34A853]' : 'bg-[#E5E4E7]'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.claimSupported ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Upload License */}
          <div>
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide block mb-1.5">
              Upload License Document
            </label>
            <label className="flex items-center gap-3 w-full px-4 py-3 border-2 border-dashed border-[#E5E4E7] hover:border-[#1A73E8]/40 rounded-xl cursor-pointer bg-[#F8F9FA] hover:bg-[#1A73E8]/5 transition-all group">
              <div className="w-8 h-8 rounded-lg bg-[#1A73E8]/10 flex items-center justify-center shrink-0 group-hover:bg-[#1A73E8]/20 transition-colors">
                <svg className="w-4 h-4 text-[#1A73E8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                {form.licenseFile ? (
                  <p className="text-xs font-semibold text-[#1A73E8] truncate">{form.licenseFile.name || form.licenseFile}</p>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-[#1C1C1E]">Click to upload</p>
                    <p className="text-[10px] text-[#6B7280]">PDF, JPG or PNG · Max 5 MB</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => set('licenseFile', e.target.files?.[0] || null)}
              />
            </label>
          </div>
        </form>

        {/* Footer Buttons */}
        <div className="bg-[#F8F9FA] px-6 py-4 border-t border-[#E5E4E7] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-[#E5E4E7] hover:bg-white text-[#6B7280] font-semibold text-xs rounded-lg transition-colors focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-[#1A73E8] hover:bg-[#155cb4] text-white font-bold text-xs rounded-lg shadow-sm transition-colors focus:outline-none"
          >
            {initial ? 'Save Changes' : 'Add Hospital'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Hospital Card ─────────────────────────────────────────────────────
function HospitalCard({ hospital, onEdit, onToggleStatus }) {
  const initials = hospital.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const statusColors = {
    Active:   { bg: 'bg-[#34A853]/5', border: 'border-[#34A853]/20', dot: 'bg-[#34A853]' },
    Pending:  { bg: 'bg-[#FBBC04]/5', border: 'border-[#FBBC04]/20', dot: 'bg-[#FBBC04]' },
    Inactive: { bg: 'bg-gray-50',     border: 'border-gray-200',      dot: 'bg-gray-400'  },
  };
  const sc = statusColors[hospital.status] || statusColors.Inactive;

  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group ${sc.border}`}>

      {/* Card Top Accent Strip */}
      <div className={`h-1 w-full ${sc.dot}`} />

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        {/* Avatar + Name row */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1A73E8]/10 text-[#1A73E8] font-bold text-sm flex items-center justify-center shrink-0 group-hover:bg-[#1A73E8]/20 transition-colors">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-sm text-[#1C1C1E] leading-snug truncate">{hospital.name}</h3>
            <p className="text-[11px] text-[#6B7280] font-medium mt-0.5">{hospital.city}</p>
          </div>
          <StatusBadge status={hospital.status} />
        </div>

        {/* Address */}
        <p className="text-[11px] text-[#6B7280] leading-relaxed line-clamp-2 flex items-start gap-1.5">
          <svg className="w-3 h-3 text-[#6B7280] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {hospital.address}
        </p>

        {/* Contact + Tags row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <ClaimTag supported={hospital.claimSupported} />
          <span className="text-[10px] text-[#6B7280] flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {hospital.contact}
          </span>
        </div>

        {/* License badge */}
        {hospital.license && (
          <div className="flex items-center gap-1.5 bg-[#1A73E8]/5 rounded-lg px-2.5 py-1.5">
            <svg className="w-3 h-3 text-[#1A73E8] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-[10px] text-[#1A73E8] font-medium truncate">{hospital.license}</span>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 pb-4 flex gap-2.5">
        {/* Edit */}
        <button
          onClick={() => onEdit(hospital)}
          className="flex-1 py-2 border border-[#E5E4E7] hover:border-[#1A73E8] hover:text-[#1A73E8] text-[#6B7280] font-semibold text-xs rounded-lg transition-all focus:outline-none flex items-center justify-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>

        {/* Activate / Deactivate */}
        <button
          onClick={() => onToggleStatus(hospital.id, hospital.status)}
          className={`flex-1 py-2 font-bold text-xs rounded-lg transition-all focus:outline-none flex items-center justify-center gap-1.5 ${
            hospital.status === 'Active'
              ? 'border border-[#EA4335]/40 text-[#EA4335] hover:bg-[#EA4335]/5'
              : 'bg-[#34A853] text-white hover:bg-[#2b8a43] shadow-sm'
          }`}
        >
          {hospital.status === 'Active' ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Deactivate
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Activate
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────
export default function Hospitals({ showToast }) {
  const [hospitals, setHospitals]     = useState(INITIAL_HOSPITALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter]   = useState('All Cities');
  const [showModal, setShowModal]     = useState(false);
  const [editTarget, setEditTarget]   = useState(null); // null = add, object = edit

  // Filtered hospitals
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return hospitals.filter((h) => {
      const matchSearch = h.name.toLowerCase().includes(q) || h.address.toLowerCase().includes(q) || h.city.toLowerCase().includes(q);
      const matchCity   = cityFilter === 'All Cities' || h.city === cityFilter;
      return matchSearch && matchCity;
    });
  }, [hospitals, searchQuery, cityFilter]);

  // Stats
  const totalActive   = hospitals.filter(h => h.status === 'Active').length;
  const totalPending  = hospitals.filter(h => h.status === 'Pending').length;
  const claimEnabled  = hospitals.filter(h => h.claimSupported).length;

  const handleSave = (form) => {
    if (editTarget) {
      setHospitals((prev) =>
        prev.map((h) => h.id === editTarget.id ? { ...h, ...form, license: form.licenseFile?.name || h.license } : h)
      );
      showToast(`Hospital "${form.name}" updated successfully.`, 'success');
    } else {
      const newId = `HSP-${String(hospitals.length + 1).padStart(3, '0')}`;
      setHospitals((prev) => [...prev, {
        id: newId, ...form,
        license: form.licenseFile?.name || null,
        status: 'Pending',
      }]);
      showToast(`Hospital "${form.name}" added and set to Pending approval.`, 'success');
    }
    setShowModal(false);
    setEditTarget(null);
  };

  const handleEdit = (hospital) => {
    setEditTarget({ ...hospital, licenseFile: hospital.license });
    setShowModal(true);
  };

  const handleToggleStatus = (id, currentStatus) => {
    const next = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setHospitals((prev) => prev.map((h) => h.id === id ? { ...h, status: next } : h));
    const hosp = hospitals.find(h => h.id === id);
    showToast(
      `${hosp?.name} has been ${next === 'Active' ? 'activated' : 'deactivated'}.`,
      next === 'Active' ? 'success' : 'error'
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">

      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display font-bold text-[22px] text-[#1C1C1E] m-0">Hospitals</h2>
          <p className="text-xs text-[#6B7280] mt-1">Manage empanelled hospitals and claim support eligibility.</p>
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
              placeholder="Search hospital, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-[#E5E4E7] rounded-lg text-[#1C1C1E] placeholder-[#6B7280] focus:ring-2 focus:ring-[#1A73E8]/20 focus:outline-none"
            />
          </div>

          {/* City Filter */}
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="text-xs bg-white border border-[#E5E4E7] rounded-lg px-3 py-1.5 text-[#1C1C1E] focus:ring-2 focus:ring-[#1A73E8]/20 focus:outline-none cursor-pointer"
          >
            {CITIES.map((c) => <option key={c}>{c}</option>)}
          </select>

          {/* Add Hospital */}
          <button
            onClick={() => { setEditTarget(null); setShowModal(true); }}
            className="bg-[#1A73E8] hover:bg-[#155cb4] text-white font-bold px-4 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors focus:outline-none"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Hospital
          </button>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Hospitals',   value: hospitals.length, color: '#1A73E8' },
          { label: 'Active',            value: totalActive,      color: '#34A853' },
          { label: 'Pending Approval',  value: totalPending,     color: '#D29E00' },
          { label: 'Claim-Enabled',     value: claimEnabled,     color: '#9C27B0' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-[#E5E4E7] p-4 shadow-sm flex items-center gap-3">
            <span className="text-2xl font-bold" style={{ color }}>{value}</span>
            <span className="text-xs text-[#6B7280] font-medium leading-snug">{label}</span>
          </div>
        ))}
      </div>

      {/* Card Grid — 3 per row */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-[#D1D5DB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#6B7280]">No hospitals match your filter.</p>
          <p className="text-xs text-[#9CA3AF] mt-1">Try adjusting the search or city filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((hospital) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <HospitalModal
          initial={editTarget}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
        />
      )}
    </div>
  );
}
