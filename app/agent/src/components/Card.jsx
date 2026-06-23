import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-[var(--color-white)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
