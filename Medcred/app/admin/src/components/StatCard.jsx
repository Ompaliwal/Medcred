/**
 * StatCard.jsx
 * Reusable summary stat card used on the Dashboard.
 * Displays: large value, uppercase title, subtitle label, colored icon circle.
 * When onClick is provided the card becomes clickable (cursor-pointer, hover border,
 * "View All →" label appears on hover).
 * Props: title | value | label | icon (Icon name string) | color (hex) | onClick?
 */
import React from 'react';
import Icon from './Icons';

export default function StatCard({ title, value, label, icon, color, onClick }) {
  // Adding '1A' to color hex to simulate a 10% opacity color background
  const bgOpacityColor = `${color}1A`;

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-[10px] p-5 shadow-sm border border-[#E5E4E7]/60 hover:shadow-md transition-all duration-200 flex flex-col justify-between group ${onClick ? 'cursor-pointer hover:border-[#1A73E8]' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[28px] font-bold text-[#1C1C1E] leading-none tracking-tight block group-hover:text-[#1A73E8] transition-colors">
            {value}
          </span>
          <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block mt-1.5 font-display">
            {title}
          </span>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
          style={{
            backgroundColor: bgOpacityColor,
            color: color,
          }}
        >
          <Icon name={icon} className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-[#F3F4F6] flex items-center justify-between">
        <span className="text-[14px] text-[#6B7280] truncate font-medium">
          {label}
        </span>
        
        {onClick ? (
          <span className="text-[10px] text-[#1A73E8] font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0 flex items-center gap-1">
            View All
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </span>
        ) : (
          <span className="text-[10px] text-[#34A853] font-semibold bg-[#34A853]/10 px-1.5 py-0.5 rounded-full shrink-0 group-hover:hidden block">
            Live
          </span>
        )}
      </div>
    </div>
  );
}
