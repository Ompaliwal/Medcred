/**
 * Toast.jsx
 * Fixed top-right toast notification stack.
 * Renders a list of toasts stacked vertically with type-based colors:
 *   success → green (#34A853), error → red (#EA4335), default → blue (#1A73E8)
 * Each toast has an icon, message text, and a manual close button.
 * Props: toasts — array of { id, message, type } | onClose(id)
 * Toast lifecycle (auto-dismiss timer) is managed in App.jsx showToast().
 */
import React from 'react';

export default function Toast({ toasts, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white pointer-events-auto transition-all duration-300 animate-slide-in ${
            t.type === 'error' ? 'bg-[#EA4335]' : 'bg-[#34A853]'
          }`}
        >
          {t.type === 'error' ? (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="text-sm font-medium">{t.message}</span>
          <button
            onClick={() => onClose(t.id)}
            className="text-white hover:text-gray-200 transition-colors ml-auto focus:outline-none text-lg font-bold line-height-none"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
