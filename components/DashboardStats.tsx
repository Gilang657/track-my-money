
import React from 'react';
import { Card, CardContent } from './ui/DesignSystem';
import { DashboardStats as StatsType } from '../types';
import { ArrowUpRight, ArrowDownRight, Wallet, PiggyBank, Edit3 } from 'lucide-react';

// Simple Hook for Odometer Effect
export const useCountUp = (end: number, duration = 1000) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function: easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      
      setCount(end * ease);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
};

interface Props {
  stats: StatsType;
  formatCurrency: (val: number) => string;
  labels: any;
  onEditBalance?: () => void;
}

export const DashboardStats: React.FC<Props> = ({ stats, formatCurrency, labels, onEditBalance }) => {
  
  const animatedBalance = useCountUp(stats.totalBalance);
  const animatedIncome = useCountUp(stats.totalIncome);
  const animatedExpense = useCountUp(stats.totalExpense);

  // Savings Rate Logic
  const savingsRate = stats.savingsRate; // Already calculated in App.tsx
  let statusColor = "text-zinc-500";
  let barColor = "bg-zinc-800";
  let statusText = labels.noIncome;

  if (stats.totalIncome > 0) {
      if (savingsRate >= 20) {
          statusColor = "text-emerald-500";
          barColor = "bg-emerald-500";
          statusText = labels.excellent;
      } else if (savingsRate > 0) {
          statusColor = "text-yellow-500";
          barColor = "bg-yellow-500";
          statusText = labels.good;
      } else {
          statusColor = "text-red-500";
          barColor = "bg-red-500";
          statusText = labels.needsWork;
      }
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
      {/* Total Balance - Spans 2 columns on mobile if we wanted, but keeping 2-col strict as requested */}
      <Card id="tour-balance" className="col-span-2 lg:col-span-1 border-l-4 border-l-orange-500 bg-gradient-to-br from-zinc-900 to-zinc-950">
        <CardContent className="flex flex-col justify-between h-full relative p-5">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-orange-500/10 rounded-full">
                <Wallet className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex items-center gap-2">
                 <span className="text-[10px] md:text-xs font-medium text-zinc-500 uppercase tracking-wider">{labels.totalBalance}</span>
                 {onEditBalance && (
                    <button onClick={onEditBalance} className="text-zinc-600 hover:text-white transition-colors">
                        <Edit3 size={12} />
                    </button>
                 )}
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{formatCurrency(animatedBalance)}</h2>
            <p className="text-xs md:text-sm text-zinc-500 mt-1">{labels.availableFunds}</p>
          </div>
        </CardContent>
      </Card>

      {/* Income */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex justify-between items-start mb-3 md:mb-4">
             <div className="p-1.5 md:p-2 bg-emerald-500/10 rounded-full">
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
            </div>
             <span className="text-[10px] md:text-xs font-medium text-zinc-500 uppercase tracking-wider">{labels.income}</span>
          </div>
          <h2 className="text-lg md:text-2xl font-bold text-white truncate">{formatCurrency(animatedIncome)}</h2>
          <p className="text-[10px] md:text-sm text-emerald-500 mt-1 flex items-center gap-1">
             +12% 
          </p>
        </CardContent>
      </Card>

      {/* Expense */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex justify-between items-start mb-3 md:mb-4">
             <div className="p-1.5 md:p-2 bg-rose-500/10 rounded-full">
                <ArrowDownRight className="w-4 h-4 md:w-5 md:h-5 text-rose-500" />
            </div>
             <span className="text-[10px] md:text-xs font-medium text-zinc-500 uppercase tracking-wider">{labels.expenses}</span>
          </div>
          <h2 className="text-lg md:text-2xl font-bold text-white truncate">{formatCurrency(animatedExpense)}</h2>
           <p className="text-[10px] md:text-sm text-rose-500 mt-1 flex items-center gap-1">
             +5% 
          </p>
        </CardContent>
      </Card>

      {/* Savings Rate */}
      <Card className="col-span-2 lg:col-span-1">
        <CardContent className="p-4 md:p-6">
           <div className="flex justify-between items-start mb-3 md:mb-4">
             <div className="p-1.5 md:p-2 bg-blue-500/10 rounded-full">
                <PiggyBank className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
            </div>
             <span className="text-[10px] md:text-xs font-medium text-zinc-500 uppercase tracking-wider">{labels.savingsRate}</span>
          </div>
          <div className="flex justify-between items-end">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                  {stats.totalIncome > 0 ? `${savingsRate.toFixed(1)}%` : '--'}
              </h2>
              <span className={`text-[10px] md:text-xs font-medium ${statusColor} mb-1.5`}>
                  {statusText}
              </span>
          </div>
           
           <div className="w-full bg-zinc-800 h-1.5 md:h-2 mt-3 rounded-full overflow-hidden">
             <div 
                className={`${barColor} h-full rounded-full transition-all duration-1000`} 
                style={{ width: `${stats.totalIncome > 0 ? Math.max(0, Math.min(savingsRate, 100)) : 0}%` }}
             ></div>
           </div>
        </CardContent>
      </Card>
    </div>
  );
};
