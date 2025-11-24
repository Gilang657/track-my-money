import React, { useState } from 'react';
import { Card, CardContent, Button, Input } from './ui/DesignSystem';
import { UserProfile, CurrencyCode, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { ArrowRight, Check, User, Coins, Target, Languages } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface Props {
  onFinish: () => void;
}

export const OnboardingWizard: React.FC<Props> = ({ onFinish }) => {
  const { updateProfile, profile } = useUser();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  // Initialize language from profile but allow changing it instantly in the wizard
  const [language, setLanguage] = useState<Language>(profile?.language || 'en');
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('IDR');
  const [budgetGoal, setBudgetGoal] = useState('');

  // Use the local language state for translations so the UI updates immediately
  const t = TRANSLATIONS[language];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const budgetNum = parseFloat(budgetGoal.replace(/[^0-9]/g, '')) || 0;
      
      const newProfile: UserProfile = {
        ...profile!,
        name: name,
        currency: currency,
        language: language, // Save the selected language
        onboardingCompleted: true,
        monthlyBudgetGoal: budgetNum
      };

      await updateProfile(newProfile);
      onFinish();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Progress bar width calculation (Total steps 4)
  const progress = (step / 4) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/95 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-md border-orange-500/20 shadow-2xl shadow-orange-500/10 relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800">
          <div 
            className="h-full bg-orange-500 transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>

        <CardContent className="p-8 pt-10">
          <div className="mb-8 text-center">
             <h2 className="text-2xl font-bold text-white mb-2">{t.welcomeSetup}</h2>
             <p className="text-zinc-400">{t.setupDesc}</p>
          </div>

          <div className="min-h-[220px] flex flex-col justify-center">
            
            {/* Step 1: Language */}
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-orange-500">
                       <Languages size={32} />
                    </div>
                 </div>
                <label className="block text-sm font-medium text-zinc-300 text-center">{t.stepLang}</label>
                <div className="grid grid-cols-2 gap-4">
                   <button
                      onClick={() => setLanguage('en')}
                      className={`
                        flex flex-col items-center justify-center p-4 rounded-xl border transition-all gap-2
                        ${language === 'en' 
                           ? 'bg-orange-500/10 border-orange-500 text-white' 
                           : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-700'}
                      `}
                    >
                      <span className="text-2xl">🇺🇸</span>
                      <span className="font-bold text-sm">English</span>
                   </button>
                   <button
                      onClick={() => setLanguage('id')}
                      className={`
                        flex flex-col items-center justify-center p-4 rounded-xl border transition-all gap-2
                        ${language === 'id' 
                           ? 'bg-orange-500/10 border-orange-500 text-white' 
                           : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-700'}
                      `}
                    >
                      <span className="text-2xl">🇮🇩</span>
                      <span className="font-bold text-sm">Indonesia</span>
                   </button>
                </div>
              </div>
            )}

            {/* Step 2: Name */}
            {step === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right-8 fade-in duration-300">
                 <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-orange-500">
                       <User size={32} />
                    </div>
                 </div>
                 <label className="block text-sm font-medium text-zinc-300 text-center">{t.step1}</label>
                 <Input 
                    autoFocus
                    placeholder={t.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-center text-lg h-12"
                 />
              </div>
            )}

            {/* Step 3: Currency */}
            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-orange-500">
                       <Coins size={32} />
                    </div>
                 </div>
                <label className="block text-sm font-medium text-zinc-300 text-center">{t.step2}</label>
                <div className="grid grid-cols-1 gap-3">
                  {(['IDR', 'USD', 'EUR'] as CurrencyCode[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`
                        flex items-center justify-between p-4 rounded-xl border transition-all
                        ${currency === c 
                           ? 'bg-orange-500/10 border-orange-500 text-white' 
                           : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-700'}
                      `}
                    >
                      <span className="font-bold">{c}</span>
                      {currency === c && <Check size={18} className="text-orange-500" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Budget */}
            {step === 4 && (
              <div className="space-y-4 animate-in slide-in-from-right-8 fade-in duration-300">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-orange-500">
                       <Target size={32} />
                    </div>
                 </div>
                <label className="block text-sm font-medium text-zinc-300 text-center">{t.step3}</label>
                <Input 
                    autoFocus
                    type="number"
                    placeholder={t.budgetPlaceholder}
                    value={budgetGoal}
                    onChange={(e) => setBudgetGoal(e.target.value)}
                    className="text-center text-lg h-12"
                 />
                 <p className="text-xs text-center text-zinc-500">
                    {t.budgetDesc}
                 </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
               <Button variant="secondary" onClick={handleBack} className="w-1/3">
                 {t.back}
               </Button>
            )}
            
            {step < 4 ? (
               <Button onClick={handleNext} disabled={step === 2 && !name} className="flex-1">
                 {t.next} <ArrowRight size={18} className="ml-2" />
               </Button>
            ) : (
               <Button onClick={handleFinish} disabled={!budgetGoal || loading} className="flex-1">
                 {loading ? t.saving : t.finish}
               </Button>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
};