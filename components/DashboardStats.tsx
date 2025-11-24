import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/DesignSystem';
import { DashboardStats as StatsType } from '../types';
import { ArrowUpRight, ArrowDownRight, Wallet, PiggyBank } from 'lucide-react';

interface Props {
  stats: StatsType;
  formatCurrency: (val: number) => string;
  labels: any;
}

// Custom Hook for Odometer Effect
const useCountUp = (end: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    
    // If end is 0, just set to 0 instantly to avoid weird float math
    if (end === 0) {
        setCount(0);
        return;
    }

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Cubic easing out for a smooth "landing"
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setCount(end * easeOut);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
};

export const DashboardStats: React.FC<Props> = ({ stats, formatCurrency, labels }) => {
  const animatedBalance = useCountUp(stats.totalBalance);
  const animatedIncome = useCountUp(stats.totalIncome);
  const animatedExpense = useCountUp(stats.totalExpense);
  const animatedSavings = useCountUp(stats.savingsRate);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Balance */}
      <Card id="tour-balance" className="border-l-4 border-l-orange-500 !bg-gradient-to-br from-zinc-900 to-zinc-950">
        <CardContent className="flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-orange-500/10 rounded-full animate-in zoom-in duration-500">
                <Wallet className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{labels.totalBalance}</span>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold text-white tracking-tight">
                {formatCurrency(animatedBalance)}
            </h2>
            <p className="text-sm text-zinc-500 mt-1">{labels.availableFunds}</p>
          </div>
        </CardContent>
      </Card>

      {/* Income */}
      <Card>
        <CardContent>
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-emerald-500/10 rounded-full animate-in zoom-in duration-500 delay-100">
                <ArrowUpRight className="w-5 h-5 text-emerald-500" />
            </div>
             <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{labels.income}</span>
          </div>
          <h2 className="text-2xl font-bold text-white">{formatCurrency(animatedIncome)}</h2>
          <p className="text-sm text-emerald-500 mt-1 flex items-center gap-1">
             +12% <span className="text-zinc-600">{labels.vsLastMonth}</span>
          </p>
        </CardContent>
      </Card>

      {/* Expense */}
      <Card>
        <CardContent>
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-rose-500/10 rounded-full animate-in zoom-in duration-500 delay-200">
                <ArrowDownRight className="w-5 h-5 text-rose-500" />
            </div>
             <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{labels.expenses}</span>
          </div>
          <h2 className="text-2xl font-bold text-white">{formatCurrency(animatedExpense)}</h2>
           <p className="text-sm text-rose-500 mt-1 flex items-center gap-1">
             +5% <span className="text-zinc-600">{labels.vsLastMonth}</span>
          </p>
        </CardContent>
      </Card>

      {/* Savings Rate */}
      <Card>
        <CardContent>
           <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-blue-500/10 rounded-full animate-in zoom-in duration-500 delay-300">
                <PiggyBank className="w-5 h-5 text-blue-500" />
            </div>
             <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{labels.savingsRate}</span>
          </div>
          <h2 className="text-2xl font-bold text-white">{animatedSavings.toFixed(1)}%</h2>
           <p className="text-sm text-zinc-500 mt-1">{labels.target}: 20%</p>
           <div className="w-full bg-zinc-800 h-1.5 mt-3 rounded-full overflow-hidden">
             <div className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(animatedSavings, 100)}%` }}></div>
           </div>
        </CardContent>
      </Card>
    </div>
  );
};