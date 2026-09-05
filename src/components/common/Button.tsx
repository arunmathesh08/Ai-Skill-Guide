import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    xs: 'px-2.5 py-1 text-xs rounded-md font-medium gap-1.5',
    sm: 'px-3.5 py-1.5 text-xs rounded-lg font-medium gap-2',
    md: 'px-4 py-2 text-sm rounded-lg font-medium gap-2',
    lg: 'px-5 py-2.5 text-base rounded-xl font-semibold gap-2.5'
  };

  const variantClasses = {
    primary:
      'bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow active:scale-[0.98] transition-all duration-150 border border-brand-700/20 disabled:bg-brand-300',
    secondary:
      'bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow active:scale-[0.98] transition-all duration-150 border border-slate-950 disabled:bg-slate-400',
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm active:scale-[0.98] transition-all duration-150',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow active:scale-[0.98] transition-all duration-150 disabled:bg-rose-300',
    accent:
      'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm active:scale-[0.98] transition-all duration-150',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-[0.98] transition-all duration-150'
  };

  return (
    <button
      className={`inline-flex items-center justify-center cursor-pointer transition-all duration-150 select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
