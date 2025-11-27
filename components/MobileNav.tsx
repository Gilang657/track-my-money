
import React from 'react';
import { LayoutDashboard, Receipt, CreditCard, Settings, Plus } from 'lucide-react';

type View = 'overview' | 'transactions' | 'budgeting' | 'settings';

interface MobileNavProps {
  activeView: View;
  onNavigate: (view: View) => void;
  onAddClick: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeView, onNavigate, onAddClick }) => {
  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => {
    const isActive = activeView === view;
    return (
      <button
        onClick={() => onNavigate(view)}
        className={`flex flex-col items-center justify-center gap-1 w-full h-full pt-2 pb-1 transition-all duration-200 active:scale-95 ${
          isActive ? 'text-orange-500' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]' : ''} />
        <span className="text-[10px] font-medium">{label}</span>
      </button>
    );
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 h-16 items-end relative">
        
        {/* Item 1: Overview */}
        <NavItem view="overview" icon={LayoutDashboard} label="Home" />

        {/* Item 2: Transactions */}
        <NavItem view="transactions" icon={Receipt} label="List" />

        {/* Center: Floating Action Button */}
        <div className="relative -top-6 flex justify-center items-start pointer-events-none">
          <button
            onClick={onAddClick}
            className="pointer-events-auto w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_4px_14px_0_rgba(249,115,22,0.5)] text-white hover:bg-orange-400 active:scale-95 transition-all duration-200 ring-4 ring-zinc-950"
            aria-label="Quick Add"
          >
            <Plus size={28} strokeWidth={2.5} />
          </button>
        </div>

        {/* Item 3: Budgeting */}
        <NavItem view="budgeting" icon={CreditCard} label="Budget" />

        {/* Item 4: Settings */}
        <NavItem view="settings" icon={Settings} label="Profile" />
        
      </div>
    </div>
  );
};
