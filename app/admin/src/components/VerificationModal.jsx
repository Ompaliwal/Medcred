/**
 * VerificationModal.jsx
 * Full-screen overlay modal for reviewing a verification request on the Dashboard.
 * Shows: applicant name, type, registration number, document filename, date.
 * Actions: Approve → green toast | Reject → red toast | Close (X or overlay click)
 * Props: selectedVerification (item or null) | onClose() | onApprove(id, name) | onReject(id, name)
 */
import React from 'react';
import Icon from './Icons';

export default function VerificationModal({
  selectedVerification,
  onClose,
  onApprove,
  onReject,
}) {
  if (!selectedVerification) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full border border-[#E5E4E7] overflow-hidden z-10 animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A73E8] to-[#155cb4] p-5 text-white flex justify-between items-center">
          <div>
            <span className="text-[10px] bg-white/20 uppercase font-bold px-2 py-0.5 rounded-full">
              ID Verification Review
            </span>
            <h3 className="font-display font-bold text-base mt-1">
              Credential Audit Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors focus:outline-none p-1.5 hover:bg-white/10 rounded-full"
          >
            <Icon name="close" />
          </button>
        </div>

        {/* Info Grid */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 p-3 bg-[#F8F9FA] rounded-lg border border-[#E5E4E7]">
            <div className="w-12 h-12 rounded-full bg-[#1A73E8]/10 text-[#1A73E8] font-bold text-sm flex items-center justify-center shrink-0">
              {selectedVerification.initial}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1C1C1E]">{selectedVerification.name}</h4>
              <p className="text-xs text-[#6B7280]">{selectedVerification.type}</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-[#F3F4F6]">
              <span className="text-[#6B7280] font-medium">Registration Number:</span>
              <span className="font-bold text-[#1C1C1E]">{selectedVerification.regNo}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F3F4F6]">
              <span className="text-[#6B7280] font-medium">Submission Date:</span>
              <span className="font-semibold text-[#1C1C1E]">{selectedVerification.date}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F3F4F6]">
              <span className="text-[#6B7280] font-medium">Attached File:</span>
              <span className="font-semibold text-[#1A73E8] underline hover:cursor-pointer flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {selectedVerification.document}
              </span>
            </div>
          </div>

          {/* Scan Preview Simulation */}
          <div className="border border-dashed border-[#E5E4E7] rounded-lg p-8 bg-[#F8F9FA] text-center">
            <svg className="w-8 h-8 text-[#6B7280] mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-[10px] text-[#6B7280] block font-medium">Simulated Document Scan Active</span>
            <span className="text-[9px] text-green-600 block font-semibold mt-1">✓ Digital Signature Validated</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#F8F9FA] px-6 py-4 border-t border-[#E5E4E7] flex justify-end gap-3">
          <button
            onClick={() => onReject(selectedVerification.id, selectedVerification.name)}
            className="px-4 py-2 border border-[#EA4335]/30 hover:bg-[#EA4335]/5 text-[#EA4335] font-semibold text-xs rounded-lg transition-colors focus:outline-none"
          >
            Reject Credentials
          </button>
          <button
            onClick={() => onApprove(selectedVerification.id, selectedVerification.name)}
            className="px-4 py-2 bg-[#34A853] hover:bg-[#2b8a43] text-white font-semibold text-xs rounded-lg shadow-sm transition-colors focus:outline-none"
          >
            Approve & Register
          </button>
        </div>
      </div>
    </div>
  );
}
