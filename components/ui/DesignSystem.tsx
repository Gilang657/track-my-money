
import React from 'react';

// --- Card Component ---
type CardProps = React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean };

export const Card = ({ children, className = '', interactive = true, ...props }: CardProps) => (
  <div 
    className={`
        relative bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md 
        transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group
        ${interactive ? 'hover:bg-zinc-900/60 hover:border-white/10 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 hover:z-10' : ''} 
        animate-in fade-in slide-in-from-bottom-4 zoom-in-95
        ${className}
    `} 
    {...props}
  >
    {/* Shiny Border Effect on Hover */}
    {interactive && <div className="absolute inset-0 border border-white/0 group-hover:border-orange-500/20 rounded-2xl transition-all duration-500 pointer-events-none"></div>}
    {children}
  </div>
);

export const CardHeader = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 pb-2 ${className}`} {...props}>{children}</div>
);

export const CardTitle = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-xl font-bold text-white tracking-tight ${className}`} {...props}>{children}</h3>
);

export const CardContent = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 ${className}`} {...props}>{children}</div>
);

// --- Button Component ---
interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none";
  
  const variants = {
    primary: "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500 shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] hover:brightness-110",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-white focus:ring-zinc-100 hover:shadow-lg hover:scale-[1.02]",
    outline: "border border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-500 focus:ring-zinc-700",
    ghost: "hover:bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/50",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]",
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
  <div className="flex flex-col gap-2 group w-full">
    {label && <label className="text-sm font-medium text-zinc-400 group-focus-within:text-orange-500 transition-colors duration-300">{label}</label>}
    <input
      className={`flex h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 ${className}`}
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
    <div className="flex flex-col gap-2 group w-full">
        {label && <label className="text-sm font-medium text-zinc-400 group-focus-within:text-orange-500 transition-colors duration-300">{label}</label>}
        <div className="relative">
            <select
                className={`flex h-10 w-full appearance-none rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 cursor-pointer hover:border-zinc-700 ${className}`}
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

// --- Switch Component (iOS Style) ---
interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Switch = ({ checked, onCheckedChange }: SwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={`
      relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950
      ${checked ? 'bg-green-500' : 'bg-zinc-700'}
    `}
  >
    <span
      className={`
        pointer-events-none block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
        ${checked ? 'translate-x-5' : 'translate-x-0'}
      `}
    />
  </button>
);

// --- Badge Component ---
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'shimmer';
}

export const Badge = ({ children, variant = 'default', className = '', ...props }: BadgeProps) => {
  const variants = {
    default: "bg-orange-500 text-white hover:bg-orange-600 shadow-sm shadow-orange-500/20",
    secondary: "bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
    outline: "border border-zinc-700 text-zinc-300 hover:border-zinc-500",
    destructive: "bg-red-500/20 text-red-500 border border-red-500/20 hover:bg-red-500/30",
    shimmer: "bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 bg-[length:200%_100%] animate-shimmer text-black font-bold shadow-[0_0_15px_rgba(234,179,8,0.4)] border border-yellow-500/50"
  };

  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

// --- Separator ---
export const Separator = ({ className = '' }: { className?: string }) => (
  <div className={`h-[1px] w-full bg-zinc-800/50 ${className}`} />
);
