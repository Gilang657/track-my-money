
import React from 'react';
import { LayoutDashboard, Receipt, Settings, CreditCard, LogOut } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Language } from '../types';
import { supabase } from '../lib/supabase'; // UPDATED IMPORT
import { financeService } from '../services/financeService';

type View = 'overview' | 'transactions' | 'budgeting' | 'settings';

interface SidebarProps {
  activeView: View;
  onNavigate: (view: View) => void;
  mobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, mobile = false, onCloseMobile }) => {
  const { profile } = useUser();
  
  // Fallback labels if profile isn't loaded yet (though App usually handles loading)
  const lang = profile?.language || 'en';
  
  const labels = {
    en: { overview: 'Overview', transactions: 'Transactions', budgeting: 'Budgeting', settings: 'Settings', signOut: 'Sign Out' },
    id: { overview: 'Ringkasan', transactions: 'Transaksi', budgeting: 'Anggaran', settings: 'Pengaturan', signOut: 'Keluar' }
  };
  
  const t = labels[lang];

  const handleLogout = async () => {
    try {
        await supabase.auth.signOut();
        financeService.clearLocalSession();
        // Force refresh to clear state
        window.location.reload();
    } catch (error) {
        console.error("Logout failed", error);
    }
  };

  const NavContent = (
    <>
      <SidebarItem 
        icon={<LayoutDashboard size={20} />} 
        label={t.overview} 
        active={activeView === 'overview'} 
        onClick={() => { onNavigate('overview'); mobile && onCloseMobile?.(); }}
      />
      <SidebarItem 
        icon={<Receipt size={20} />} 
        label={t.transactions}
        active={activeView === 'transactions'} 
        onClick={() => { onNavigate('transactions'); mobile && onCloseMobile?.(); }}
      />
      <SidebarItem 
        icon={<CreditCard size={20} />} 
        label={t.budgeting}
        active={activeView === 'budgeting'} 
        onClick={() => { onNavigate('budgeting'); mobile && onCloseMobile?.(); }}
      />
      <SidebarItem 
        icon={<Settings size={20} />} 
        label={t.settings}
        active={activeView === 'settings'} 
        onClick={() => { onNavigate('settings'); mobile && onCloseMobile?.(); }}
      />
    </>
  );

  if (mobile) {
    return (
      <div className="fixed inset-0 bg-zinc-950/95 z-50 p-6 flex flex-col gap-2 md:hidden animate-in fade-in duration-200">
         <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
             <h2 className="text-xl font-bold text-white">Menu</h2>
             <button onClick={onCloseMobile} className="text-zinc-400 hover:text-white p-2 transition-transform active:scale-95">
                 <LogOut size={20} className="rotate-180"/> 
             </button>
         </div>
         {NavContent}
         
         <div className="mt-auto pt-6 border-t border-zinc-800">
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-all"
            >
                <LogOut size={20} />
                {t.signOut}
            </button>
         </div>
      </div>
    );
  }

  return (
    <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 border-r border-zinc-800 bg-zinc-950/80 backdrop-blur-xl z-50">
      <div className="p-6">
        <h1 className="text-3xl font-bold tracking-tighter text-white">
          ghifar<span className="text-orange-500">mkcy</span>.
        </h1>
        <p className="text-xs text-zinc-500 mt-1">Personal Finance</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {NavContent}
      </nav>

      <div className="px-4 pb-4">
        {/* User Profile Section - Connected to Global State */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 group cursor-pointer hover:border-zinc-700 hover:shadow-lg transition-all duration-300">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-black group-hover:bg-orange-400 group-hover:scale-110 transition-all duration-300">
               {profile?.name.charAt(0).toUpperCase() || 'U'}
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-medium text-white truncate group-hover:text-orange-500 transition-colors">{profile?.name || 'User'}</p>
               <p className="text-xs text-zinc-500 truncate">Premium Plan</p>
             </div>
           </div>
           
           <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
           >
               <LogOut size={14} />
               {t.signOut}
           </button>
        </div>
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
      active 
        ? 'bg-zinc-800 text-white border border-zinc-700/50 shadow-lg shadow-black/20 translate-x-1' 
        : 'text-zinc-400 hover:text-white hover:bg-zinc-900 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
    }`}
  >
    {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l-lg" />}
    <span className={`transition-colors duration-200 ${active ? 'text-orange-500' : 'group-hover:text-orange-500/80'}`}>{icon}</span>
    {label}
  </button>
);
