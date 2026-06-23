import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-[var(--color-primary)] text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-[var(--color-secondary)] text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-[var(--color-danger)] text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent hover:bg-blue-50 focus:ring-blue-500',
    ghost: 'text-[var(--color-text)] bg-transparent hover:bg-gray-100 focus:ring-gray-500'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
