
import React, { useEffect, useState, useMemo } from 'react';
import { Bell, Loader2, CheckCircle2, User, Settings, BellRing, Database, ChevronRight, LogOut, Shield, Play, Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion'; 
import { DashboardStats } from './components/DashboardStats';
import { Analytics } from './components/Analytics';
import { TransactionList } from './components/TransactionList';
import { TransactionForm } from './components/TransactionForm';
import { BudgetView } from './components/BudgetView';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav'; 
import { DateRangePicker } from './components/ui/DateRangePicker'; 
import { OnboardingWizard } from './components/OnboardingWizard'; 
import { AppTour } from './components/AppTour'; 
import { AuthPage } from './components/AuthPage';
import { LandingPage } from './components/LandingPage';
import { financeService } from './services/financeService';
import { Transaction, DashboardStats as StatsType, UserProfile, CurrencyCode, BudgetLimits, DateRange } from './types';
import { TRANSLATIONS } from './constants';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Switch, Badge, Separator, Dialog } from './components/ui/DesignSystem';
import { UserProvider, useUser } from './contexts/UserContext';
import { supabase } from './lib/supabase';

type View = 'overview' | 'transactions' | 'budgeting' | 'settings';

const formatNumberString = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseFormattedNumber = (value: string) => {
    return parseFloat(value.replace(/\./g, '')) || 0;
};

// Inner App Component to consume Context (only rendered when authenticated)
const AppContent = () => {
  const { profile, loading: userLoading, updateProfile, refreshProfile } = useUser();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetLimits, setBudgetLimits] = useState<BudgetLimits>({});
  
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const now = new Date();
    return {
      from: new Date(now.getFullYear(), now.getMonth(), 1),
      to: now
    };
  });

  const [dataLoading, setDataLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [activeView, setActiveView] = useState<View>('overview');
  const [toast, setToast] = useState<{message: string, visible: boolean}>({ message: '', visible: false });

  // Balance Modal State
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [tempBalance, setTempBalance] = useState('');

  // Quick Add Modal State (Mobile FAB)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- Data Fetching ---
  const loadData = async () => {
    // Only load data if profile is loaded to ensure currency/settings are available
    if (!profile) return;
    
    setDataLoading(true);
    try {
      const [txData, budgetData] = await Promise.all([
        financeService.getTransactions(),
        financeService.getBudgetLimits()
      ]);
      setTransactions(txData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setBudgetLimits(budgetData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
        loadData();
    }
  }, [profile]); // Reload data when profile loads or updates

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  // --- Actions ---
  const handleAddTransaction = async (newTx: Omit<Transaction, 'id' | 'created_at'>) => {
    setActionLoading(true);
    try {
      const added = await financeService.addTransaction(newTx);
      // Optimistic update or refetch
      setTransactions(prev => [added, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      showToast("Transaction added successfully");
      setIsAddModalOpen(false); 
    } catch (error) {
        console.error(error);
        showToast("Failed to add transaction");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await financeService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      showToast("Transaction deleted");
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const handleUpdateBudgets = async (newLimits: BudgetLimits) => {
    try {
        await financeService.updateBudgetLimits(newLimits);
        setBudgetLimits(newLimits);
        showToast("Budgets updated successfully!");
    } catch (error) {
        console.error("Failed to update budgets", error);
    }
  };

  const handleSaveInitialBalance = async () => {
     if (!profile) return;
     const num = parseFormattedNumber(tempBalance); 
     try {
         await updateProfile({ ...profile, initialBalance: num });
         setIsBalanceModalOpen(false);
         showToast("Initial balance updated");
     } catch (e) {
         console.error(e);
     }
  };

  const openBalanceModal = () => {
      const initial = profile?.initialBalance?.toString() || '';
      setTempBalance(formatNumberString(initial));
      setIsBalanceModalOpen(true);
  };

  const handleInjectDemoData = async () => {
     if(confirm("This will overwrite your current data with demo data. Continue?")) {
         try {
            await financeService.injectDemoData();
         } catch(e) {
             console.error("Demo injection failed", e);
             showToast("Failed to inject demo data");
         }
     }
  };

  const handleLogout = async () => {
    try {
        await supabase.auth.signOut();
        window.location.reload();
    } catch (error) {
        console.error("Logout failed", error);
    }
  };

  // --- Helpers & Filtering ---
  const t = TRANSLATIONS[profile?.language || 'en'];
  const activeCategories = useMemo(() => Object.keys(budgetLimits).sort(), [budgetLimits]);

  const formatCurrency = (amount: number) => {
    const currency = profile?.currency || 'USD';
    return new Intl.NumberFormat(profile?.language === 'id' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredTransactions = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return transactions;
    
    const from = new Date(dateRange.from);
    from.setHours(0, 0, 0, 0);
    const to = new Date(dateRange.to);
    to.setHours(23, 59, 59, 999);

    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= from && tDate <= to;
    });
  }, [transactions, dateRange]);

  const stats: StatsType = useMemo(() => {
    const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    
    const initial = profile?.initialBalance || 0;
    const totalBalance = initial + totalIncome - totalExpense;
    
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    return { totalBalance, totalIncome, totalExpense, savingsRate };
  }, [filteredTransactions, profile?.initialBalance]);

  // --- Settings View (Simplified for brevity, logic remains) ---
  const SettingsView = () => {
    const [formState, setFormState] = useState<UserProfile>(profile!);
    const [activeTab, setActiveTab] = useState('account');

    const handleSave = async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setSettingsLoading(true);
      try {
        await updateProfile(formState);
        showToast("Settings saved successfully!");
      } catch (e) {
        showToast("Failed to save settings");
      } finally {
        setSettingsLoading(false);
      }
    };

    const handleToggle = (field: keyof UserProfile, val: boolean) => {
      const newState = { ...formState, [field]: val };
      setFormState(newState);
    };

    const renderMenuItem = (id: string, label: string, icon: React.ReactNode) => (
      <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
          activeTab === id 
            ? 'bg-zinc-800 text-white shadow-md' 
            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
        }`}
      >
        <span className={`${activeTab === id ? 'text-orange-500' : 'text-zinc-500'}`}>{icon}</span>
        {label}
        {activeTab === id && <ChevronRight size={16} className="ml-auto text-zinc-500 animate-in fade-in" />}
      </button>
    );

    return (
      <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-4 mb-2">General</h3>
          {renderMenuItem('account', t.accountSettings, <User size={18} />)}
          {renderMenuItem('preferences', t.preferences, <Settings size={18} />)}
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-4 mt-6 mb-2">System</h3>
          {renderMenuItem('notifications', 'Notifications', <BellRing size={18} />)}
          {renderMenuItem('data', 'Data & Privacy', <Database size={18} />)}
        </div>

        <div className="flex-1 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
            <form onSubmit={handleSave} className="max-w-2xl mx-auto space-y-8">
               {activeTab === 'account' && (
                 <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="relative h-32 rounded-2xl bg-gradient-to-r from-orange-600 to-purple-700 overflow-hidden mb-12">
                       <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
                       <div className="absolute -bottom-10 left-6 flex items-end gap-4">
                          <div className="w-24 h-24 rounded-full bg-zinc-900 p-1 ring-4 ring-zinc-900">
                             <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center text-3xl font-bold text-orange-500">
                                {formState.name ? formState.name.charAt(0).toUpperCase() : 'U'}
                             </div>
                          </div>
                          <div className="mb-3">
                             <h2 className="text-2xl font-bold text-white drop-shadow-md">{formState.name || 'User'}</h2>
                             <div className="flex gap-2">
                                <Badge variant="shimmer">PRO MEMBER</Badge>
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-6 pt-4">
                        <div>
                           <h3 className="text-lg font-medium text-white mb-4">Profile Information</h3>
                           <div className="bg-zinc-950/50 border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5">
                              <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                 <label className="text-sm font-medium text-zinc-400 w-32">{t.displayName}</label>
                                 <Input value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} className="bg-transparent border-none text-right focus:ring-0 focus:bg-zinc-900/50 h-auto py-1 px-2 md:w-64"/>
                              </div>
                              <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                 <label className="text-sm font-medium text-zinc-400 w-32">{t.email}</label>
                                 <div className="text-sm text-zinc-500 px-2">{formState.email}</div>
                              </div>
                           </div>
                        </div>
                    </div>
                 </div>
               )}
               {activeTab === 'preferences' && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                     <div>
                        <h3 className="text-lg font-medium text-white mb-1">App Preferences</h3>
                        <p className="text-sm text-zinc-500 mb-6">Customize your local currency and language.</p>
                        <div className="bg-zinc-950/50 border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5">
                           <div className="p-4 flex items-center justify-between">
                              <div><div className="text-sm font-medium text-white">{t.currency}</div><div className="text-xs text-zinc-500">Symbol displayed on all transactions</div></div>
                              <select className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none" value={formState.currency} onChange={(e) => setFormState({...formState, currency: e.target.value as CurrencyCode})}>
                                  <option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="IDR">IDR (Rp)</option>
                              </select>
                           </div>
                           <div className="p-4 flex items-center justify-between">
                              <div><div className="text-sm font-medium text-white">{t.language}</div><div className="text-xs text-zinc-500">Language for the user interface</div></div>
                              <select className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none" value={formState.language} onChange={(e) => setFormState({...formState, language: e.target.value as any})}>
                                  <option value="en">English</option><option value="id">Bahasa Indonesia</option>
                              </select>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
               {activeTab === 'notifications' && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                      <div>
                        <h3 className="text-lg font-medium text-white mb-1">Email Notifications</h3>
                        <div className="bg-zinc-950/50 border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5">
                           <div className="p-4 flex items-center justify-between">
                              <div className="pr-4"><div className="text-sm font-medium text-white">Weekly Summary</div></div>
                              <Switch checked={formState.emailAlerts || false} onCheckedChange={(c) => handleToggle('emailAlerts', c)}/>
                           </div>
                           <div className="p-4 flex items-center justify-between">
                              <div className="pr-4"><div className="text-sm font-medium text-white">Monthly Report</div></div>
                              <Switch checked={formState.monthlyReport || false} onCheckedChange={(c) => handleToggle('monthlyReport', c)}/>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
               {activeTab === 'data' && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                     <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                        <div className="flex items-start gap-4">
                           <div className="p-3 bg-red-500/10 rounded-full text-red-500"><Shield size={24} /></div>
                           <div>
                              <h3 className="text-lg font-medium text-red-500 mb-1">Danger Zone</h3>
                              <div className="space-y-4">
                                  <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-blue-500/10">
                                     <div><div className="text-sm font-medium text-blue-400">Inject Demo Data</div></div>
                                     <Button variant="secondary" size="sm" type="button" onClick={handleInjectDemoData}><Play size={14} className="mr-2" /> Inject Data</Button>
                                  </div>
                                  <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-red-500/10">
                                     <div><div className="text-sm font-medium text-white">Delete All Data</div></div>
                                     <Button variant="danger" size="sm" type="button" onClick={() => alert("Please contact support to perform a full reset.")}>Reset Data</Button>
                                  </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
               <div className="block md:hidden pt-8">
                  <Button variant="danger" type="button" className="w-full h-12" onClick={handleLogout}>
                     <LogOut size={18} className="mr-2" />
                     {t.signOut}
                  </Button>
               </div>
            </form>
          </div>
          <div className="p-6 border-t border-white/5 bg-zinc-950/30 flex justify-end">
             <Button onClick={(e) => handleSave(e)} disabled={settingsLoading} className="min-w-[120px]">
                {settingsLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                {settingsLoading ? t.saving : t.saveChanges}
             </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    const content = (() => {
      switch (activeView) {
        case 'overview': return <div className="space-y-6"><DashboardStats stats={stats} formatCurrency={formatCurrency} labels={t} onEditBalance={openBalanceModal}/><Analytics transactions={filteredTransactions} labels={t} formatCurrency={formatCurrency} currency={profile?.currency || 'USD'}/><div className="grid grid-cols-1 xl:grid-cols-3 gap-6"><div className="xl:col-span-2 order-2 xl:order-1"><TransactionList transactions={filteredTransactions.slice(0, 5)} onDelete={handleDeleteTransaction} formatCurrency={formatCurrency} labels={t} /></div><div className="hidden md:block xl:col-span-1 order-1 xl:order-2"><TransactionForm onAdd={handleAddTransaction} loading={actionLoading} labels={t} categories={activeCategories} currency={profile!.currency}/></div></div></div>;
        case 'transactions': return <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full"><div className="xl:col-span-2 order-2 xl:order-1 h-full"><TransactionList transactions={filteredTransactions} onDelete={handleDeleteTransaction} formatCurrency={formatCurrency} labels={t} /></div><div className="hidden md:block xl:col-span-1 order-1 xl:order-2"><TransactionForm onAdd={handleAddTransaction} loading={actionLoading} labels={t} categories={activeCategories} currency={profile!.currency}/></div></div>;
        case 'budgeting': return <BudgetView transactions={filteredTransactions} budgetLimits={budgetLimits} onUpdateLimits={handleUpdateBudgets} formatCurrency={formatCurrency} labels={t}/>;
        case 'settings': return <SettingsView />;
        default: return null;
      }
    })();
    return <div key={activeView} className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]">{content}</div>;
  };

  if (userLoading || !profile) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><div className="flex flex-col items-center gap-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div><p className="text-zinc-500 text-sm animate-pulse">Loading Profile...</p></div></div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-orange-500/30 overflow-x-hidden">
      {!profile.onboardingCompleted && <OnboardingWizard onFinish={() => { refreshProfile(); showToast("Setup complete! Welcome aboard."); }} />}
      <AppTour />
      <Dialog open={isBalanceModalOpen} onOpenChange={setIsBalanceModalOpen} title={t.setInitialBalance}><div className="space-y-4"><p className="text-sm text-zinc-400">{t.initialBalanceDesc}</p><Input type="text" inputMode="numeric" value={tempBalance} onChange={e => setTempBalance(formatNumberString(e.target.value))} placeholder="0" autoFocus/><div className="flex justify-end gap-2 pt-2"><Button variant="secondary" onClick={() => setIsBalanceModalOpen(false)}>{t.cancel}</Button><Button onClick={handleSaveInitialBalance}>{t.save}</Button></div></div></Dialog>
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen} title={t.addTransaction}><TransactionForm onAdd={handleAddTransaction} loading={actionLoading} labels={t} categories={activeCategories} currency={profile!.currency}/></Dialog>
      {toast.visible && <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-right-10 fade-in duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"><div className="bg-zinc-900 border border-emerald-500/20 text-emerald-500 px-4 py-3 rounded-lg shadow-2xl shadow-emerald-500/10 flex items-center gap-2 backdrop-blur-md"><CheckCircle2 size={18} /><span className="font-medium text-sm">{toast.message}</span></div></div>}
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <MobileNav activeView={activeView} onNavigate={setActiveView} onAddClick={() => setIsAddModalOpen(true)}/>
      <main className="md:pl-64 min-h-screen transition-all duration-300"><div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-32"><div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-in fade-in slide-in-from-top-4 duration-700 delay-100"><div><h2 className="text-2xl md:text-3xl font-bold text-white capitalize tracking-tight">{profile?.language === 'id' && activeView === 'overview' ? 'Ringkasan' : activeView}</h2><p className="text-zinc-400 mt-1 text-sm md:text-base">{activeView === 'overview' && t?.welcome}{activeView === 'transactions' && t?.manageTx}{activeView === 'budgeting' && t?.trackBudget}{activeView === 'settings' && t?.managePref}</p></div><div className="flex items-center gap-4 w-full md:w-auto">{activeView !== 'settings' && <DateRangePicker id="tour-filter" date={dateRange} setDate={setDateRange} className="w-full md:w-auto" />}<button className="hidden md:block p-2 rounded-full hover:bg-zinc-800 text-zinc-400 relative transition-all hover:scale-105 hover:text-white group"><Bell size={20} className="group-hover:animate-pulse" /><span className="absolute top-1.5 right-2 w-2 h-2 bg-orange-500 rounded-full border border-zinc-950"></span></button></div></div><div className="min-h-[500px]">{renderContent()}</div></div></main>
    </div>
  );
};

// Root App Wraps Content handling Session
const App = () => {
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // 1. Check Initial Session
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (err) {
        console.error("Session Error:", err);
      } finally {
        setLoading(false);
      }
    };
    initSession();

    // 2. Listen for Auth Changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      // If we sign in, we simply let the UserContext refetch the profile.
      // If we sign out, session becomes null and we go to landing/auth.
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>;
  }

  return (
    <AnimatePresence mode="wait">
      {!session ? (
         showAuth ? (
             <motion.div key="auth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <AuthPage onBack={() => setShowAuth(false)} />
             </motion.div>
         ) : (
             <motion.div key="landing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <LandingPage onStart={() => setShowAuth(true)} />
             </motion.div>
         )
      ) : (
        <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <UserProvider>
                <AppContent />
            </UserProvider>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default App;
