import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from './ui/DesignSystem';
import { supabase } from '../lib/supabaseClient';
import { TRANSLATIONS } from '../constants';
import { Loader2, AlertCircle } from 'lucide-react';

export const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default to English for Auth page for now, or detect browser lang
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
        // Automatically switch to login or notify to check email
        alert('Check your email for the confirmation link!');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter text-white mb-2">
            ghifar<span className="text-orange-500">mkcy</span>.
          </h1>
          <p className="text-zinc-500">Personal Finance Tracker</p>
        </div>

        <Card className="border-orange-500/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center">
              {mode === 'login' ? t.loginTitle : t.registerTitle}
            </CardTitle>
            <p className="text-center text-sm text-zinc-500 mt-2">
              {mode === 'login' ? t.loginDesc : t.registerDesc}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
              
              <Input 
                label={t.email} 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input 
                label={t.password} 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : (mode === 'login' ? t.signIn : t.signUp)}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-zinc-500">
                {mode === 'login' ? t.noAccount : t.hasAccount}{' '}
              </span>
              <button 
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}
                className="text-orange-500 hover:underline font-medium"
              >
                {mode === 'login' ? t.signUp : t.signIn}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
