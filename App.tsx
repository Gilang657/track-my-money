import React, { useEffect, useState, useMemo } from 'react';
import { Menu, Bell, Loader2, CheckCircle2 } from 'lucide-react';
import { DashboardStats } from './components/DashboardStats';
import { Analytics } from './components/Analytics';
import { TransactionList } from './components/TransactionList';
import { TransactionForm } from './components/TransactionForm';
import { BudgetView } from './components/BudgetView';
import { Sidebar } from './components/Sidebar';
import { DateRangePicker } from './components/ui/DateRangePicker'; 
import { OnboardingWizard } from './components/OnboardingWizard'; 
import { AppTour } from './components/AppTour'; 
import { AuthPage } from './components/AuthPage';
import { financeService } from './services/financeService';
import { Transaction, DashboardStats as StatsType, UserProfile, CurrencyCode, BudgetLimits, DateRange } from './types';
import { TRANSLATIONS } from './constants';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Switch, Badge } from './components/ui/DesignSystem';
import { UserProvider, useUser } from './contexts/UserContext';
import { supabase } from './lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

type View = 'overview' | 'transactions' | 'budgeting' | 'settings';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('overview');
  const [toast, setToast] = useState<{message: string, visible: boolean}>({ message: '', visible: false });

  // --- Data Fetching ---
  const loadData = async () => {
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
    loadData();
  }, []);

  useEffect(() => {
    if (profile?.currency) {
        loadData();
    }
  }, [profile?.currency]);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  // --- Actions ---
  const handleAddTransaction = async (newTx: Omit<Transaction, 'id' | 'created_at'>) => {
    setActionLoading(true);
    try {
      const added = await financeService.addTransaction(newTx);
      setTransactions(prev => [added, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      showToast("Transaction added successfully");
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
    const totalBalance = totalIncome - totalExpense;
    
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    return { totalBalance, totalIncome, totalExpense, savingsRate };
  }, [filteredTransactions]);

  // --- Settings View ---
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

    // Auto-save toggle switches for better UX
    const handleToggle = (field: keyof UserProfile, val: boolean) => {
      const newState = { ...formState, [field]: val };
      setFormState(newState);
      // Optional: Auto save
    };

    return (
      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[500px]">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 flex flex-col gap-1">
          {['account', 'preferences', 'notifications', 'data'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-zinc-800 text-white border-l-2 border-orange-500' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          <form onSubmit={handleSave} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             
             {activeTab === 'account' && (
               <Card>
                 <CardHeader>
                   <CardTitle>{t.accountSettings}</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-2xl font-bold text-orange-500 border-2 border-orange-500/20 shadow-lg shadow-orange-500/10">
                          {formState.name ? formState.name.charAt(0).toUpperCase() : 'U'}
                       </div>
                       <div>
                          <div className="text-sm text-zinc-500">Profile Picture</div>
                          <div className="flex gap-2 mt-2">
                             <Badge variant="outline">Free Plan</Badge>
                             <Badge>Pro</Badge>
                          </div>
                       </div>
                    </div>
                    <Input 
                      label={t.displayName} 
                      value={formState.name} 
                      onChange={e => setFormState({...formState, name: e.target.value})}
                    />
                    <Input 
                      label={t.email}
                      value={formState.email} 
                      onChange={e => setFormState({...formState, email: e.target.value})}
                      disabled
                      className="opacity-50 cursor-not-allowed"
                    />
                 </CardContent>
               </Card>
             )}

             {activeTab === 'preferences' && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t.preferences}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                        <div>
                          <h4 className="font-medium text-white">{t.currency}</h4>
                          <p className="text-xs text-zinc-500 mt-1">Updates transaction values automatically.</p>
                        </div>
                        <select 
                            className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none"
                            value={formState.currency}
                            onChange={(e) => setFormState({...formState, currency: e.target.value as CurrencyCode})}
                        >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="IDR">IDR (Rp)</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                        <div>
                          <h4 className="font-medium text-white">{t.language}</h4>
                        </div>
                        <select 
                            className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none"
                            value={formState.language}
                            onChange={(e) => setFormState({...formState, language: e.target.value as any})}
                        >
                            <option value="en">English</option>
                            <option value="id">Bahasa Indonesia</option>
                        </select>
                      </div>
                  </CardContent>
                </Card>
             )}

             {activeTab === 'notifications' && (
                <Card>
                   <CardHeader>
                      <CardTitle>Notifications</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                        <div>
                          <h4 className="font-medium text-white">Email Alerts</h4>
                          <p className="text-xs text-zinc-500">Receive weekly spending summaries</p>
                        </div>
                        <Switch 
                            checked={formState.emailAlerts || false}
                            onCheckedChange={(c) => handleToggle('emailAlerts', c)}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                        <div>
                          <h4 className="font-medium text-white">Monthly Report</h4>
                          <p className="text-xs text-zinc-500">Get a detailed analysis at month end</p>
                        </div>
                        <Switch 
                             checked={formState.monthlyReport || false}
                             onCheckedChange={(c) => handleToggle('monthlyReport', c)}
                        />
                      </div>
                   </CardContent>
                </Card>
             )}

             {activeTab === 'data' && (
                 <Card className="border-red-500/20">
                    <CardHeader>
                       <CardTitle className="text-red-500">Danger Zone</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/10 flex items-center justify-between">
                          <div>
                             <h4 className="font-medium text-white">Reset All Data</h4>
                             <p className="text-xs text-zinc-400">Permanently delete all transactions and budgets.</p>
                          </div>
                          <Button variant="danger" size="sm" type="button" onClick={() => alert("Contact support to reset data.")}>
                             Reset Data
                          </Button>
                       </div>
                    </CardContent>
                 </Card>
             )}

             <div className="pt-4 border-t border-zinc-800 flex justify-end">
                <Button type="submit" disabled={settingsLoading} className="w-full sm:w-auto min-w-[150px]">
                  {settingsLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin w-4 h-4" />
                      {t.saving}
                    </div>
                  ) : t.saveChanges}
                </Button>
             </div>
          </form>
        </div>
      </div>
    );
  };

  // --- Render Router ---
  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <>
            <DashboardStats stats={stats} formatCurrency={formatCurrency} labels={t} />
            <Analytics transactions={filteredTransactions} labels={t} formatCurrency={formatCurrency} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
               <div className="xl:col-span-2 order-2 xl:order-1">
                  <TransactionList transactions={filteredTransactions.slice(0, 5)} onDelete={handleDeleteTransaction} formatCurrency={formatCurrency} labels={t} />
               </div>
               <div className="xl:col-span-1 order-1 xl:order-2">
                  <TransactionForm 
                    onAdd={handleAddTransaction} 
                    loading={actionLoading} 
                    labels={t} 
                    categories={activeCategories} 
                    currency={profile!.currency}
                  />
               </div>
            </div>
          </>
        );
      case 'transactions':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
             <div className="xl:col-span-2 order-2 xl:order-1 h-full">
                <TransactionList transactions={filteredTransactions} onDelete={handleDeleteTransaction} formatCurrency={formatCurrency} labels={t} />
             </div>
             <div className="xl:col-span-1 order-1 xl:order-2">
                <TransactionForm 
                    onAdd={handleAddTransaction} 
                    loading={actionLoading} 
                    labels={t} 
                    categories={activeCategories}
                    currency={profile!.currency}
                />
             </div>
          </div>
        );
      case 'budgeting':
        return (
          <BudgetView 
            transactions={filteredTransactions}
            budgetLimits={budgetLimits}
            onUpdateLimits={handleUpdateBudgets}
            formatCurrency={formatCurrency}
            labels={t}
          />
        );
      case 'settings':
        return <SettingsView />;
      default:
        return null;
    }
  };

  // --- Global Loading (User Profile) ---
  if (userLoading || !profile) {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <p className="text-zinc-500 text-sm animate-pulse">Loading Profile...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-orange-500/30">
      
      {/* Onboarding Wizard - Shown if incomplete */}
      {!profile.onboardingCompleted && (
        <OnboardingWizard onFinish={() => { 
            refreshProfile();
            showToast("Setup complete! Welcome aboard."); 
        }} />
      )}

      {/* Product Tour - Shown if complete but not seen */}
      <AppTour />

      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-right-10 fade-in duration-300">
          <div className="bg-zinc-900 border border-emerald-500/20 text-emerald-500 px-4 py-3 rounded-lg shadow-2xl shadow-emerald-500/10 flex items-center gap-2 backdrop-blur-md">
            <CheckCircle2 size={18} />
            <span className="font-medium text-sm">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Desktop Sidebar - Uses Global Context internally */}
      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <h1 className="text-xl font-bold">ghifar<span className="text-orange-500">mkcy</span>.</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-zinc-400 hover:text-white transition-colors">
          <Menu />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <Sidebar 
            activeView={activeView} 
            onNavigate={setActiveView} 
            mobile 
            onCloseMobile={() => setMobileMenuOpen(false)} 
        />
      )}

      {/* Main Content */}
      <main className="md:pl-64 min-h-screen transition-all duration-300">
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
             <div>
               <h2 className="text-2xl font-bold text-white capitalize">{profile?.language === 'id' && activeView === 'overview' ? 'Ringkasan' : activeView}</h2>
               <p className="text-zinc-400">
                 {activeView === 'overview' && t?.welcome}
                 {activeView === 'transactions' && t?.manageTx}
                 {activeView === 'budgeting' && t?.trackBudget}
                 {activeView === 'settings' && t?.managePref}
               </p>
             </div>
             
             {/* Actions Area */}
             <div className="flex items-center gap-4">
                {activeView !== 'settings' && (
                  <DateRangePicker id="tour-filter" date={dateRange} setDate={setDateRange} />
                )}

                <button className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 relative transition-colors hover:text-white">
                   <Bell size={20} />
                   <span className="absolute top-1.5 right-2 w-2 h-2 bg-orange-500 rounded-full border border-zinc-950"></span>
                </button>
             </div>
          </div>

          <div key={activeView} className="animate-in fade-in slide-in-from-bottom-8 duration-500 ease-in-out">
            {renderContent()}
          </div>

        </div>
      </main>
    </div>
  );
};

// Root App Wraps Content handling Session
const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
    );
  }

  // Gatekeeper: If no session, show Auth Page
  if (!session) {
    return <AuthPage />;
  }

  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;
