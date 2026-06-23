import React from 'react';

const Badge = ({ children, status = 'active', className = '', ...props }) => {
  const statusStyles = {
    active: 'bg-green-100 text-[var(--color-secondary)]',
    success: 'bg-green-100 text-[var(--color-secondary)]',
    pending: 'bg-yellow-100 text-[var(--color-warning)]',
    warning: 'bg-yellow-100 text-[var(--color-warning)]',
    rejected: 'bg-red-100 text-[var(--color-danger)]',
    danger: 'bg-red-100 text-[var(--color-danger)]',
    expired: 'bg-gray-100 text-[var(--color-subtext)]',
    default: 'bg-blue-100 text-[var(--color-primary)]'
  };

  const selectedStyle = statusStyles[status.toLowerCase()] || statusStyles.default;

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedStyle} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
