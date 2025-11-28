import { createClient } from '@supabase/supabase-js';

// Ambil dari Environment Variable (Settingan Vercel/Laptop)
// Biar aman dan gak bocor di GitHub
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validasi buat ngecek kalau lupa setting di Vercel
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ FATAL ERROR: Supabase URL atau Key belum disetting di .env atau Vercel!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
