import React from 'react';

// --- Card Component ---
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export const Card = ({ children, className = '', interactive = true, ...props }: CardProps) => {
  // Base classes for glassmorphism and structure
  const baseClasses = "group relative bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-4 zoom-in-95 fill-mode-backwards";
  
  // Interactive classes (Hover effects)
  const hoverClasses = interactive 
    ? "hover:bg-zinc-900/95 hover:border-orange-500/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-1.5 hover:z-10 cursor-default" 
    : "";

  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`} {...props}>
      {/* Subtle Glow Gradient on Hover - Only if interactive */}
      {interactive && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      )}
      
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 pb-2 ${className}`} {...props}>{children}</div>
);

export const CardTitle = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-xl font-bold text-white tracking-tight ${className}`} {...props}>{children}</h3>
);

export const CardContent = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 ${className}`} {...props}>{children}</div>
);

// --- Badge Component ---
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'danger';
}

export const Badge = ({ children, variant = 'default', className = '', ...props }: BadgeProps) => {
  const variants = {
    default: "bg-zinc-800 text-zinc-300",
    outline: "border border-zinc-700 text-zinc-400",
    success: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    warning: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

// --- Switch Component ---
interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Switch = ({ checked, onCheckedChange, disabled = false }: SwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => !disabled && onCheckedChange(!checked)}
    className={`
      relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent 
      transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 
      ${checked ? 'bg-orange-500' : 'bg-zinc-700'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
  >
    <span
      className={`
        pointer-events-none block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 
        transition duration-200 ease-in-out
        ${checked ? 'translate-x-5' : 'translate-x-0'}
      `}
    />
  </button>
);

// --- Button Component ---
interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 relative overflow-hidden";
  
  const variants = {
    primary: "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] border border-transparent",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-white focus:ring-zinc-100 hover:shadow-lg border border-transparent",
    outline: "border border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 focus:ring-zinc-700",
    ghost: "hover:bg-zinc-800 text-zinc-400 hover:text-white",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 focus:ring-red-500",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-8 text-lg",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Input Component ---
interface InputProps extends React.ComponentProps<'input'> {
  label?: string;
}

export const Input = ({ label, className = '', ...props }: InputProps) => (
  <div className="flex flex-col gap-2 group">
    {label && <label className="text-sm font-medium text-zinc-400 group-focus-within:text-orange-500 transition-colors duration-300">{label}</label>}
    <input
      className={`flex h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 ${className}`}
      {...props}
    />
  </div>
);

// --- Select Component ---
interface SelectProps extends React.ComponentProps<'select'> {
    label?: string;
    options: { value: string; label: string }[];
}

export const Select = ({ label, options, className = '', ...props }: SelectProps) => (
    <div className="flex flex-col gap-2 group">
        {label && <label className="text-sm font-medium text-zinc-400 group-focus-within:text-orange-500 transition-colors duration-300">{label}</label>}
        <div className="relative">
            <select
                className={`flex h-10 w-full appearance-none rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 cursor-pointer hover:border-zinc-700 ${className}`}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    </div>
);