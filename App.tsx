import React, { useEffect, useState, useMemo } from 'react';
import { Menu, Bell, Loader2, CheckCircle2, User, Settings, Database, BellRing, ChevronRight, ShieldAlert, LogOut, Crown } from 'lucide-react';
import { DashboardStats } from './components/DashboardStats';
import { Analytics } from './components/Analytics';
import { TransactionList } from './components/TransactionList';
import { TransactionForm } from './components/TransactionForm';
import { BudgetView } from './components/BudgetView';
import { Sidebar } from './components/Sidebar';
import { DateRangePicker } from './components/ui/DateRangePicker'; 
import { OnboardingWizard } from './components/OnboardingWizard'; 
import { AppTour } from './components/AppTour'; 
import { financeService } from './services/financeService';
import { Transaction, DashboardStats as StatsType, UserProfile, CurrencyCode, BudgetLimits, DateRange } from './types';
import { TRANSLATIONS } from './constants';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Switch, Badge } from './components/ui/DesignSystem';
import { UserProvider, useUser } from './contexts/UserContext';

type View = 'overview' | 'transactions' | 'budgeting' | 'settings';
type SettingsTab = 'account' | 'preferences' | 'data';

// --- Inner App Component ---
const AppContent = () => {
  const { profile, loading: userLoading, updateProfile, refreshProfile } = useUser();
  
  // App Global State
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('overview');
  const [toast, setToast] = useState<{message: string, visible: boolean}>({ message: '', visible: false });

  // Settings Local State
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>('account');

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

  useEffect(() => { loadData(); }, []);
  useEffect(() => { if (profile?.currency) loadData(); }, [profile?.currency]);

  // --- Helpers ---
  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const formatCurrency = (amount: number) => {
    const currency = profile?.currency || 'USD';
    return new Intl.NumberFormat(profile?.language === 'id' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const t = TRANSLATIONS[profile?.language || 'en'];

  // --- Logic Filtering ---
  const filteredTransactions = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return transactions;
    const from = new Date(dateRange.from); from.setHours(0, 0, 0, 0);
    const to = new Date(dateRange.to); to.setHours(23, 59, 59, 999);
    return transactions.filter(t => { const d = new Date(t.date); return d >= from && d <= to; });
  }, [transactions, dateRange]);

  const stats: StatsType = useMemo(() => {
    const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const totalBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
    return { totalBalance, totalIncome, totalExpense, savingsRate };
  }, [filteredTransactions]);

  const activeCategories = useMemo(() => Object.keys(budgetLimits).sort(), [budgetLimits]);

  // --- Actions ---
  const handleAddTransaction = async (newTx: Omit<Transaction, 'id' | 'created_at'>) => {
    setActionLoading(true);
    try {
      const added = await financeService.addTransaction(newTx);
      setTransactions(prev => [added, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      showToast("Transaction added successfully");
    } finally { setActionLoading(false); }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    await financeService.deleteTransaction(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast("Transaction deleted");
  };

  const handleUpdateBudgets = async (newLimits: BudgetLimits) => {
    await financeService.updateBudgetLimits(newLimits);
    setBudgetLimits(newLimits);
    showToast("Budgets updated successfully!");
  };

  // --- Revamped Settings View ---
  const SettingsView = () => {
    const [formState, setFormState] = useState<UserProfile>({
        ...profile!,
        emailAlerts: profile?.emailAlerts ?? true,
        monthlyReport: profile?.monthlyReport ?? false
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setSaving(true);
      try {
        await updateProfile(formState);
        showToast("Settings updated successfully!");
      } catch (e) {
        showToast("Failed to save settings");
      } finally {
        setSaving(false);
      }
    };

    const handleResetData = () => {
        if(confirm("DANGER: This will wipe all transactions. Are you sure?")) {
            localStorage.clear();
            window.location.reload();
        }
    }

    const tabs = [
        { id: 'account', label: t.accountSettings, icon: User },
        { id: 'preferences', label: t.preferences, icon: Settings },
        { id: 'data', label: 'Data & Privacy', icon: Database },
    ];

    return (
      <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
            <Card className="h-full">
                <CardContent className="p-4 space-y-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSettingsTab(tab.id as SettingsTab)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                activeSettingsTab === tab.id 
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <tab.icon size={18} />
                                {tab.label}
                            </div>
                            {activeSettingsTab === tab.id && <ChevronRight size={16} className="text-white/80" />}
                        </button>
                    ))}
                    
                    <div className="pt-4 mt-4 border-t border-zinc-800">
                        <div className="px-4 py-2 bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-xl mb-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Crown size={16} className="text-yellow-500" />
                                <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Pro Plan</span>
                            </div>
                            <p className="text-[10px] text-zinc-400">Your subscription is active until Dec 2025.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1">
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                
                {/* ACCOUNT TAB */}
                {activeSettingsTab === 'account' && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="relative group cursor-pointer">
                                        <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center text-3xl font-bold text-orange-500 border-4 border-zinc-950 shadow-2xl ring-2 ring-orange-500/20 group-hover:ring-orange-500 transition-all">
                                            {formState.name ? formState.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center border-2 border-zinc-950 text-zinc-400 group-hover:text-white group-hover:bg-orange-500 transition-colors">
                                            <Settings size={14} />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h3 className="text-lg font-medium text-white">{formState.name}</h3>
                                        <p className="text-sm text-zinc-500">{formState.email || 'No email set'}</p>
                                        <Badge variant="success">Active</Badge>
                                    </div>
                                </div>
                                <div className="grid gap-4">
                                    <Input 
                                        label={t.displayName} 
                                        value={formState.name} 
                                        onChange={e => setFormState({...formState, name: e.target.value})}
                                    />
                                    <Input 
                                        label={t.email}
                                        value={formState.email} 
                                        onChange={e => setFormState({...formState, email: e.target.value})}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                         <div className="flex justify-end">
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                {t.saveChanges}
                            </Button>
                        </div>
                    </div>
                )}

                {/* PREFERENCES TAB */}
                {activeSettingsTab === 'preferences' && (
                     <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>App Preferences</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">{t.currency}</label>
                                        <select 
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none hover:border-zinc-700 transition-colors"
                                            value={formState.currency}
                                            onChange={(e) => setFormState({...formState, currency: e.target.value as CurrencyCode})}
                                        >
                                            <option value="USD">USD ($) - United States Dollar</option>
                                            <option value="EUR">EUR (€) - Euro</option>
                                            <option value="IDR">IDR (Rp) - Indonesian Rupiah</option>
                                        </select>
                                        <p className="text-xs text-zinc-500">Affects all transaction displays.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">{t.language}</label>
                                        <select 
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none hover:border-zinc-700 transition-colors"
                                            value={formState.language}
                                            onChange={(e) => setFormState({...formState, language: e.target.value as any})}
                                        >
                                            <option value="en">English (US)</option>
                                            <option value="id">Bahasa Indonesia</option>
                                        </select>
                                        <p className="text-xs text-zinc-500">Changes UI text immediately.</p>
                                    </div>
                                </div>

                                <div className="border-t border-zinc-800 my-4 pt-4">
                                    <h4 className="text-sm font-medium text-white mb-4">Notifications</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-zinc-300">Email Alerts</p>
                                                <p className="text-xs text-zinc-500">Get notified for large expenses</p>
                                            </div>
                                            <Switch 
                                                checked={formState.emailAlerts ?? true} 
                                                onCheckedChange={(checked) => setFormState({...formState, emailAlerts: checked})} 
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-zinc-300">Monthly Report</p>
                                                <p className="text-xs text-zinc-500">Receive a summary at end of month</p>
                                            </div>
                                            <Switch 
                                                checked={formState.monthlyReport ?? false} 
                                                onCheckedChange={(checked) => setFormState({...formState, monthlyReport: checked})} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <div className="flex justify-end">
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                {t.saveChanges}
                            </Button>
                        </div>
                     </div>
                )}

                {/* DATA TAB */}
                {activeSettingsTab === 'data' && (
                    <div className="space-y-6">
                        <Card className="border-red-900/30 bg-red-900/5">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <ShieldAlert className="text-red-500" />
                                    <CardTitle className="text-red-500">Danger Zone</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-zinc-400">
                                    Irreversible actions. Be careful.
                                </p>
                                <div className="flex items-center justify-between p-4 border border-red-900/30 rounded-xl bg-red-900/10">
                                    <div>
                                        <p className="font-medium text-red-400">Clear All Data</p>
                                        <p className="text-xs text-red-400/60">Deletes all transactions, budgets, and settings locally.</p>
                                    </div>
                                    <Button variant="danger" size="sm" onClick={handleResetData}>
                                        Reset Everything
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
      </div>
    );
  };

  // --- Main Render Content Switch ---
  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-8">
            <DashboardStats stats={stats} formatCurrency={formatCurrency} labels={t} />
            <Analytics transactions={filteredTransactions} labels={t} formatCurrency={formatCurrency} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
               <div className="xl:col-span-2 order-2 xl:order-1">
                  <TransactionList transactions={filteredTransactions.slice(0, 5)} onDelete={handleDeleteTransaction} formatCurrency={formatCurrency} labels={t} />
               </div>
               <div className="xl:col-span-1 order-1 xl:order-2">
                  <TransactionForm onAdd={handleAddTransaction} loading={actionLoading} labels={t} categories={activeCategories} currency={profile!.currency} />
               </div>
            </div>
          </div>
        );
      case 'transactions':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="xl:col-span-2 order-2 xl:order-1 h-full">
                <TransactionList transactions={filteredTransactions} onDelete={handleDeleteTransaction} formatCurrency={formatCurrency} labels={t} />
             </div>
             <div className="xl:col-span-1 order-1 xl:order-2">
                <TransactionForm onAdd={handleAddTransaction} loading={actionLoading} labels={t} categories={activeCategories} currency={profile!.currency} />
             </div>
          </div>
        );
      case 'budgeting':
        return (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <BudgetView transactions={filteredTransactions} budgetLimits={budgetLimits} onUpdateLimits={handleUpdateBudgets} formatCurrency={formatCurrency} labels={t} />
          </div>
        );
      case 'settings':
        return <SettingsView />;
      default: return null;
    }
  };

  // --- Loading ---
  if (userLoading || (dataLoading && activeView !== 'settings' && !profile)) {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-orange-500 w-10 h-10" />
                <p className="text-zinc-500 text-sm animate-pulse">Initializing ghifarmkcy...</p>
            </div>
        </div>
    );
  }

  // --- Layout ---
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-orange-500/30">
      {profile && !profile.onboardingCompleted && <OnboardingWizard onFinish={() => { refreshProfile(); showToast("Setup complete!"); }} />}
      <AppTour />

      {/* Toast */}
      {toast.visible && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-right-10 fade-in duration-300">
          <div className="bg-zinc-900 border border-emerald-500/20 text-emerald-500 px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 backdrop-blur-md">
            <CheckCircle2 size={18} /> <span className="font-medium text-sm">{toast.message}</span>
          </div>
        </div>
      )}

      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50">
        <h1 className="text-xl font-bold">ghifar<span className="text-orange-500">mkcy</span>.</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-zinc-400 hover:text-white"><Menu /></button>
      </div>
      {mobileMenuOpen && <Sidebar activeView={activeView} onNavigate={setActiveView} mobile onCloseMobile={() => setMobileMenuOpen(false)} />}

      <main className="md:pl-64 min-h-screen transition-all duration-300">
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
             <div>
               <h2 className="text-2xl font-bold text-white capitalize flex items-center gap-2">
                 {activeView === 'settings' ? t.settings : (activeView === 'overview' && t.language === 'id' ? 'Ringkasan' : activeView)}
                 {activeView === 'settings' && <Badge variant="outline" className="ml-2">v2.4.0</Badge>}
               </h2>
               <p className="text-zinc-400 mt-1">
                 {activeView === 'overview' && t?.welcome}
                 {activeView === 'transactions' && t?.manageTx}
                 {activeView === 'budgeting' && t?.trackBudget}
                 {activeView === 'settings' && t?.managePref}
               </p>
             </div>
             
             <div className="flex items-center gap-4">
                {activeView !== 'settings' && <DateRangePicker id="tour-filter" date={dateRange} setDate={setDateRange} />}
                <button className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 relative transition-colors group">
                   <Bell size={20} className="group-hover:text-white transition-colors" />
                   <span className="absolute top-2 right-2.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-zinc-950"></span>
                </button>
             </div>
          </div>

          <div key={activeView} className="min-h-[500px]">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

const App = () => ( <UserProvider> <AppContent /> </UserProvider> );
export default App;