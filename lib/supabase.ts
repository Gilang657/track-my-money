
import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// SUPABASE URL AND KEY
// ------------------------------------------------------------------
const SUPABASE_URL = 'sb_publishable_kUnSgWa3tQJe4G0rt1kk7g_5i-VQUPs'; 
const SUPABASE_ANON_KEY = 'sb_secret_IJv_PZrgay1mVpkGikM3lw_n7Q8VgR2';

// Validasi CRITICAL agar developer sadar belum ganti key
if (SUPABASE_URL.includes('xyzcompany') || SUPABASE_ANON_KEY.includes('your-anon-key')) {
    console.error("⛔ FATAL ERROR: Supabase URL/Key belum diganti di lib/supabase.ts");
    if (typeof window !== 'undefined') {
        alert("SETUP ERROR: Harap buka file 'lib/supabase.ts' dan ganti SUPABASE_URL & ANON_KEY dengan milik Anda dari Supabase Dashboard.");
    }
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
}) as any;
