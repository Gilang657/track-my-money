import { Transaction, UserProfile, BudgetLimits, CurrencyCode } from '../types';
import { INITIAL_TRANSACTIONS, DEFAULT_CATEGORIES, EXCHANGE_RATES, generateDemoData } from '../constants';

const TX_STORAGE_KEY = 'ghifarmkcy_transactions';
const SETTINGS_STORAGE_KEY = 'ghifarmkcy_settings';
const BUDGET_STORAGE_KEY = 'ghifarmkcy_budgets';
const TOUR_STORAGE_KEY = 'ghifarmkcy_tour_seen';

// Modified Default Settings to act as a "New User" for onboarding demo
const DEFAULT_SETTINGS: UserProfile = {
  name: '', 
  email: '',
  currency: 'IDR', // Default as requested in onboarding prompt
  language: 'en',
  darkMode: true,
  onboardingCompleted: false,
  emailAlerts: true,
  monthlyReport: true,
  initialBalance: 0
};

// Initialize defaults if empty
const DEFAULT_BUDGETS: BudgetLimits = DEFAULT_CATEGORIES.reduce((acc, cat) => {
  acc[cat] = 0; // Start with 0 for new users
  return acc;
}, {} as BudgetLimits);

export const financeService = {
  getTransactions: async (): Promise<Transaction[]> => {
    await new Promise(resolve => setTimeout(resolve, 600)); 
    
    const stored = localStorage.getItem(TX_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    return JSON.parse(stored);
  },

  addTransaction: async (transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };

    const current = JSON.parse(localStorage.getItem(TX_STORAGE_KEY) || '[]');
    const updated = [newTransaction, ...current];
    localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(updated));
    
    return newTransaction;
  },

  deleteTransaction: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const current = JSON.parse(localStorage.getItem(TX_STORAGE_KEY) || '[]');
    const updated = current.filter((t: Transaction) => t.id !== id);
    localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(updated));
  },

  getUserSettings: async (): Promise<UserProfile> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  },

  updateUserSettings: async (settings: UserProfile): Promise<UserProfile> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    return settings;
  },

  getBudgetLimits: async (): Promise<BudgetLimits> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const stored = localStorage.getItem(BUDGET_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_BUDGETS;
  },

  updateBudgetLimits: async (limits: BudgetLimits): Promise<BudgetLimits> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(limits));
    return limits;
  },

  convertDataCurrency: async (from: CurrencyCode, to: CurrencyCode): Promise<void> => {
     if (from === to) return;

     // 1. Calculate Rate
     const rate = EXCHANGE_RATES[to] / EXCHANGE_RATES[from];

     // 2. Convert Transactions
     const transactions = JSON.parse(localStorage.getItem(TX_STORAGE_KEY) || '[]') as Transaction[];
     const updatedTransactions = transactions.map(t => ({
        ...t,
        amount: Math.round(t.amount * rate * 100) / 100 
     }));
     localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(updatedTransactions));

     // 3. Convert Budgets
     const budgets = JSON.parse(localStorage.getItem(BUDGET_STORAGE_KEY) || JSON.stringify(DEFAULT_BUDGETS)) as BudgetLimits;
     const updatedBudgets: BudgetLimits = {};
     Object.keys(budgets).forEach(key => {
         updatedBudgets[key] = Math.round(budgets[key] * rate * 100) / 100;
     });
     localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(updatedBudgets));
     
     // 4. Convert Initial Balance
     const settings = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || JSON.stringify(DEFAULT_SETTINGS)) as UserProfile;
     if (settings.initialBalance) {
        settings.initialBalance = Math.round(settings.initialBalance * rate * 100) / 100;
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
     }
  },

  clearLocalSession: () => {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    localStorage.removeItem(TOUR_STORAGE_KEY);
    // Optionally keep transactions or clear them:
    // localStorage.removeItem(TX_STORAGE_KEY);
    // localStorage.removeItem(BUDGET_STORAGE_KEY);
  },

  injectDemoData: async () => {
    // 1. Transactions
    const demoTxs = generateDemoData();
    localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(demoTxs));

    // 2. Budgets
    const demoBudgets: BudgetLimits = {};
    DEFAULT_CATEGORIES.forEach(cat => {
        demoBudgets[cat] = 2000000; // 2 million IDR estimate
    });
    localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(demoBudgets));

    // 3. Settings/Profile
    const settings = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || JSON.stringify(DEFAULT_SETTINGS)) as UserProfile;
    settings.name = "Demo User";
    settings.initialBalance = 10000000; // 10 million IDR
    settings.onboardingCompleted = true;
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    
    // Refresh to apply
    window.location.reload();
  }
};