
import { Transaction, UserProfile, BudgetLimits, CurrencyCode } from '../types';
import { DEFAULT_CATEGORIES, generateDemoData } from '../constants';
import { supabase } from '../lib/supabase';

// Default object for fresh users who don't have a row in 'profiles' table yet
const DEFAULT_SETTINGS: UserProfile = {
  name: '', 
  email: '',
  currency: 'IDR', 
  language: 'en',
  darkMode: true,
  onboardingCompleted: false,
  tourCompleted: false,
  emailAlerts: true,
  monthlyReport: true,
  initialBalance: 0
};

// --- Helper: Map DB snake_case to App camelCase ---
const mapProfileFromDB = (data: any): UserProfile => ({
  name: data.name || '',
  email: data.email || '',
  currency: data.currency || 'IDR',
  language: data.language || 'en',
  darkMode: data.dark_mode ?? true,
  onboardingCompleted: data.onboarding_completed ?? false,
  tourCompleted: data.tour_completed ?? false,
  emailAlerts: data.email_alerts ?? true,
  monthlyReport: data.monthly_report ?? true,
  initialBalance: data.initial_balance || 0,
  monthlyBudgetGoal: data.monthly_budget_goal || 0
});

const mapProfileToDB = (profile: UserProfile) => ({
  name: profile.name,
  // email is usually read-only from auth, but we can store a display email
  currency: profile.currency,
  language: profile.language,
  dark_mode: profile.darkMode,
  onboarding_completed: profile.onboardingCompleted,
  tour_completed: profile.tourCompleted,
  email_alerts: profile.emailAlerts,
  monthly_report: profile.monthlyReport,
  initial_balance: profile.initialBalance,
  monthly_budget_goal: profile.monthlyBudgetGoal
});

export const financeService = {
  /**
   * Fetch Transactions from Supabase
   * Filters automatically by the authenticated user via RLS (Row Level Security)
   */
  getTransactions: async (): Promise<Transaction[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
    return data || [];
  },

  /**
   * Add a single transaction to Supabase
   */
  addTransaction: async (transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const newTx = {
      ...transaction,
      user_id: user.id, // Critical: Attach User ID
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert([newTx])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete transaction from Supabase
   */
  deleteTransaction: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Get User Profile/Settings
   * Tries to fetch from 'profiles' table. If empty, returns default.
   */
  getUserSettings: async (): Promise<UserProfile> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return DEFAULT_SETTINGS;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      // If no profile exists yet, return default (Authentication might have succeeded, but profile creation failed or is pending)
      return { ...DEFAULT_SETTINGS, email: user.email || '' };
    }

    return mapProfileFromDB(data);
  },

  /**
   * Update (Upsert) User Profile
   */
  updateUserSettings: async (settings: UserProfile): Promise<UserProfile> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const dbPayload = {
      id: user.id, // Upsert requires ID
      updated_at: new Date().toISOString(),
      ...mapProfileToDB(settings)
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(dbPayload);

    if (error) throw error;
    return settings;
  },

  /**
   * Get Budget Limits
   * Assuming budget limits are stored in a 'budget_limits' JSONB column in profiles 
   * OR a separate table. For this fix, we will assume a separate table 'budget_limits'
   * or mapping it to the profile. 
   * 
   * Implementation: Using a specific table 'budget_limits' (user_id, category, amount)
   */
  getBudgetLimits: async (): Promise<BudgetLimits> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {};

    const { data, error } = await supabase
      .from('budget_limits')
      .select('category, amount')
      .eq('user_id', user.id);

    if (error) {
       console.error("Error fetching budgets:", error);
       return {};
    }

    // Convert array to Record<string, number>
    const limits: BudgetLimits = {};
    data?.forEach((item: any) => {
        limits[item.category] = item.amount;
    });

    return limits;
  },

  /**
   * Update Budget Limits
   * Performs an upsert for each category
   */
  updateBudgetLimits: async (limits: BudgetLimits): Promise<BudgetLimits> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const upsertData = Object.entries(limits).map(([category, amount]) => ({
        user_id: user.id,
        category,
        amount
    }));

    if (upsertData.length === 0) return {};

    // We first delete existing (simple way to handle removals) or just upsert.
    // Upsert is safer.
    const { error } = await supabase
        .from('budget_limits')
        .upsert(upsertData, { onConflict: 'user_id, category' });

    if (error) throw error;
    return limits;
  },

  convertDataCurrency: async (from: CurrencyCode, to: CurrencyCode): Promise<void> => {
     // NOTE: Backend conversion is complex. 
     // For this frontend-fix request, we will skip server-side batch updates 
     // to avoid timeout issues, or user must manually handle amounts.
     // Ideally, this should be a Supabase Edge Function.
     console.warn("Currency conversion requested. Note: Historical transaction amounts in DB are not auto-converted to prevent data corruption.");
  },

  clearLocalSession: () => {
    // No-op: We don't use local storage anymore. 
    // Kept for interface compatibility if needed.
  },

  injectDemoData: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // 1. Generate Data & Attach User ID
    const demoTxs = generateDemoData().map(t => ({
        ...t,
        user_id: user.id, // FIX: Attach User ID
        // Ensure ID is undefined so DB auto-generates UUID, 
        // OR ensure the mock generator creates valid UUIDs. 
        // safest is to remove ID and let DB handle it:
        id: undefined 
    }));

    // 2. Bulk Insert Transactions
    const { error: txError } = await supabase
        .from('transactions')
        .insert(demoTxs);

    if (txError) throw txError;

    // 3. Set Demo Budgets
    const demoBudgets = DEFAULT_CATEGORIES.map(cat => ({
        user_id: user.id,
        category: cat,
        amount: 2000000
    }));

    const { error: budgetError } = await supabase
        .from('budget_limits')
        .upsert(demoBudgets, { onConflict: 'user_id, category' });

    if (budgetError) throw budgetError;

    // 4. Update Profile
    await financeService.updateUserSettings({
        ...DEFAULT_SETTINGS,
        name: "Demo User",
        initialBalance: 10000000,
        onboardingCompleted: true,
        tourCompleted: true
    });
    
    // 5. Force Reload
    window.location.reload();
  }
};
