import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ 
  label, 
  error, 
  icon: Icon,
  className = '',
  type = 'text',
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordForm = type === 'password';
  const currentType = isPasswordForm ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-[var(--color-text)]">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-[var(--color-subtext)]" />
          </div>
        )}
        <input
          type={currentType}
          className={`
            block w-full rounded-md shadow-sm sm:text-sm
            ${Icon ? 'pl-10' : 'pl-3'}
            ${isPasswordForm ? 'pr-10' : 'pr-3'}
            py-2 
            border border-[var(--color-border)]
            focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
            outline-none transition-colors
            ${error ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)] focus:border-[var(--color-danger)]' : ''}
          `}
          {...props}
        />
        {isPasswordForm && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-subtext)] hover:text-[var(--color-text)] focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-[var(--color-danger)] mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
