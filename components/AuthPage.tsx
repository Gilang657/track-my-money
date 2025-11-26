import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from './ui/DesignSystem';
import { supabase } from '../lib/supabase';
import { TRANSLATIONS } from '../constants';
import { Loader2, AlertCircle, ArrowRight, Globe, ArrowLeft } from 'lucide-react';
import { Language } from '../types';

interface AuthPageProps {
    onBack: () => void;
}

export const AuthPage = ({ onBack }: AuthPageProps) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('id'); // Default to Indonesia

  const t = TRANSLATIONS[lang];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert(lang === 'id' ? 'Cek email Anda untuk link konfirmasi!' : 'Check your email for the confirmation link!');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Back Button (Top Left) */}
      <div className="absolute top-6 left-6 z-50 animate-in fade-in duration-1000">
         <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white px-4 py-2 rounded-full border border-white/5 hover:bg-white/5 hover:border-white/20 transition-all backdrop-blur-sm"
         >
            <ArrowLeft size={14} />
            {t.back}
         </button>
      </div>

      {/* Language Toggle (Top Right) */}
      <div className="absolute top-6 right-6 z-50 animate-in fade-in duration-1000">
         <button 
            onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
            className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white px-4 py-2 rounded-full border border-white/5 hover:bg-white/5 hover:border-white/20 transition-all backdrop-blur-sm"
         >
            <Globe size={14} />
            {lang.toUpperCase()}
         </button>
      </div>

      {/* --- Professional Background FX --- */}
      {/* 1. Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40"></div>
      
      {/* 2. Gradient Orbs - Slower, more elegant animation */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] animate-float pointer-events-none transition-all duration-1000"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-float delay-1000 pointer-events-none transition-all duration-1000"></div>

      {/* 3. Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold tracking-tighter text-white mb-3 drop-shadow-2xl">
            ghifar<span className="text-orange-500">mkcy</span>.
          </h1>
          <p className="text-zinc-400 text-lg font-light tracking-wide">Master your personal finance.</p>
        </div>

        {/* Glassmorphism Card */}
        <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden relative group">
          
          {/* Subtle top highlight */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>

          <div className="p-8 md:p-10">
            <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">
              {mode === 'login' ? t.loginTitle : t.registerTitle}
            </h2>
            <p className="text-center text-sm text-zinc-500 mb-8 leading-relaxed">
              {mode === 'login' ? t.loginDesc : t.registerDesc}
            </p>

            <form onSubmit={handleAuth} className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-3 animate-in slide-in-from-top-2">
                  <AlertCircle size={18} />
                  <span className="font-medium">{error}</span>
                </div>
              )}
              
              <div className="space-y-4">
                  <Input 
                    label={t.email} 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-black/40 border-white/5 focus:border-orange-500/50 focus:bg-black/60 transition-all h-12"
                  />
                  <Input 
                    label={t.password} 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-black/40 border-white/5 focus:border-orange-500/50 focus:bg-black/60 transition-all h-12"
                  />
              </div>

              <Button type="submit" className="w-full h-12 text-base font-semibold shadow-xl shadow-orange-900/10 hover:shadow-orange-500/20 transition-all duration-300 mt-2" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : (
                   <span className="flex items-center justify-center gap-2">
                      {mode === 'login' ? t.signIn : t.signUp} <ArrowRight size={18} />
                   </span>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center text-sm">
              <span className="text-zinc-500">
                {mode === 'login' ? t.noAccount : t.hasAccount}{' '}
              </span>
              <button 
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}
                className="text-orange-500 hover:text-orange-400 hover:underline font-semibold transition-colors ml-1"
              >
                {mode === 'login' ? t.signUp : t.signIn}
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-center text-[10px] text-zinc-700 mt-8 uppercase tracking-widest font-semibold opacity-50">
            Secured by Supabase Auth
        </p>
      </div>
    </div>
  );
};
