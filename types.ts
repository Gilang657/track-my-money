
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: TransactionType;
  date: string;
  created_at: string;
}

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  savingsRate: number;
}

export interface MonthlyData {
  name: string;
  income: number;
  expense: number;
}

export type Language = 'en' | 'id';
export type CurrencyCode = 'USD' | 'IDR' | 'EUR';

export interface UserProfile {
  name: string;
  email: string;
  currency: CurrencyCode;
  language: Language;
  darkMode: boolean;
  onboardingCompleted: boolean;
  tourCompleted?: boolean; // New field to track tutorial status
  monthlyBudgetGoal?: number;
  emailAlerts?: boolean;
  monthlyReport?: boolean;
  initialBalance?: number;
}

export type BudgetLimits = Record<string, number>;

export interface DateRange {
  from: Date;
  to: Date;
}
