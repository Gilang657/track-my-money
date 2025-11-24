
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from './ui/DesignSystem';
import { supabase } from '../lib/supabase'; // UPDATED IMPORT
import { TRANSLATIONS } from '../constants';
import { Loader2, AlertCircle, ArrowRight } from 'lucide-react';

export const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = TRANSLATIONS['en'];

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
        alert('Check your email for the confirmation link!');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* --- Professional Background FX --- */}
      {/* 1. Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40"></div>
      
      {/* 2. Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] animate-float pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-float delay-1000 pointer-events-none"></div>

      {/* 3. Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tighter text-white mb-2 drop-shadow-2xl">
            ghifar<span className="text-orange-500">mkcy</span>.
          </h1>
          <p className="text-zinc-400 text-lg">Master your personal finance.</p>
        </div>

        {/* Glassmorphism Card */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center text-white mb-2">
              {mode === 'login' ? t.loginTitle : t.registerTitle}
            </h2>
            <p className="text-center text-sm text-zinc-400 mb-6">
              {mode === 'login' ? t.loginDesc : t.registerDesc}
            </p>

            <form onSubmit={handleAuth} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
              
              <Input 
                label={t.email} 
                type="email" 
                placeholder="name@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/30 border-white/10 focus:border-orange-500/50 focus:bg-black/50 transition-all"
              />
              <Input 
                label={t.password} 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black/30 border-white/10 focus:border-orange-500/50 focus:bg-black/50 transition-all"
              />

              <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-orange-900/20" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : (
                   <span className="flex items-center justify-center gap-2">
                      {mode === 'login' ? t.signIn : t.signUp} <ArrowRight size={16} />
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
                className="text-orange-400 hover:text-orange-300 hover:underline font-medium transition-colors"
              >
                {mode === 'login' ? t.signUp : t.signIn}
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-center text-xs text-zinc-700 mt-8">
            Secured by Supabase Auth
        </p>
      </div>
    </div>
  );
};
