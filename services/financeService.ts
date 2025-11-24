import { supabase } from '../lib/supabase'; // Pastikan path ini bener!
import { Transaction, UserProfile, BudgetLimits, CurrencyCode } from '../types';
import { DEFAULT_CATEGORIES, EXCHANGE_RATES } from '../constants';

// Default Settings (Kalau user baru pertama kali masuk)
const DEFAULT_SETTINGS: UserProfile = {
  name: '',
  email: '',
  currency: 'IDR',
  language: 'en',
  darkMode: true,
  onboardingCompleted: false,
  emailAlerts: true,
  monthlyReport: false
};

const DEFAULT_BUDGETS: BudgetLimits = DEFAULT_CATEGORIES.reduce((acc, cat) => {
  acc[cat] = 0;
  return acc;
}, {} as BudgetLimits);

export const financeService = {
  // 1. AMBIL TRANSAKSI (READ)
  getTransactions: async (): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false }); // Urutkan dari yang terbaru

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
    return data || [];
  },

  // 2. TAMBAH TRANSAKSI (CREATE)
  addTransaction: async (transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction> => {
    // Kita gak perlu bikin ID manual (Math.random), Supabase yang bikinin
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        description: transaction.description,
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.date,
        type: transaction.type
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
    return data;
  },

  // 3. HAPUS TRANSAKSI (DELETE)
  deleteTransaction: async (id: string | number): Promise<void> => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  // 4. AMBIL USER SETTINGS (PROFILE)
  getUserSettings: async (): Promise<UserProfile> => {
    // Cek user login sekarang siapa
    const { data: { user } } = await supabase.auth.getUser();
    
    // Kalau belum login, return default (atau lu bisa paksa login di sini)
    if (!user) return DEFAULT_SETTINGS;

    // Ambil data dari tabel user_settings
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 itu error kalau data kosong (wajar buat user baru)
      console.error('Error fetching settings:', error);
    }

    // Kalau data ada di DB, pake itu. Kalau gak ada, return DEFAULT
    if (data) {
      return {
        ...DEFAULT_SETTINGS,
        name: data.display_name, // Mapping nama kolom DB ke nama object frontend
        currency: data.currency || 'IDR',
        // Mapping lain sesuai kebutuhan
      };
    }

    return DEFAULT_SETTINGS;
  },

  // 5. UPDATE USER SETTINGS
  updateUserSettings: async (settings: UserProfile): Promise<UserProfile> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return settings; // Safety check

    const { error } = await supabase
      .from('user_settings')
      .upsert({
        id: user.id, // Pastikan ID-nya sama kayak user yang login
        display_name: settings.name,
        currency: settings.currency,
        // monthly_budget: settings.monthlyBudget (Kalau lu mau simpan budget total)
      });

    if (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
    return settings;
  },

  // 6. AMBIL BUDGET LIMITS
  getBudgetLimits: async (): Promise<BudgetLimits> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return DEFAULT_BUDGETS;

    const { data } = await supabase
      .from('user_settings')
      .select('budget_limits')
      .single();

    if (data && data.budget_limits) {
      return data.budget_limits as BudgetLimits;
    }
    return DEFAULT_BUDGETS;
  },

  // 7. UPDATE BUDGET LIMITS
  updateBudgetLimits: async (limits: BudgetLimits): Promise<BudgetLimits> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return limits;

    const { error } = await supabase
      .from('user_settings')
      .upsert({
        id: user.id,
        budget_limits: limits // Disimpan ke kolom JSONB baru tadi
      });

    if (error) {
      console.error('Error updating budgets:', error);
      throw error;
    }
    return limits;
  },

  // 8. KONVERSI MATA UANG (Client Side Logic)
  // Ini tetep jalan di browser aja karena convert data yang udah diambil
  convertDataCurrency: async (from: CurrencyCode, to: CurrencyCode): Promise<void> => {
     if (from === to) return;
     const rate = EXCHANGE_RATES[to] / EXCHANGE_RATES[from];

     // Logic ini agak tricky kalau pake database. 
     // Idealnya kita simpan base currency di DB, terus convert cuma pas NAMPILIN.
     // Tapi kalau mau permanen ubah angka di DB, lu harus loop update satu-satu (Bahaya & Lambat).
     // SARAN GUE: Untuk portofolio awal, fitur convert massal ini matikan dulu atau
     // biarkan logic-nya cuma visual di frontend, jangan ubah angka di database.
     console.log(`Switching currency view from ${from} to ${to} with rate ${rate}`);
  }
}