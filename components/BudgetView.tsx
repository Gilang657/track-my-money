import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from './ui/DesignSystem';
import { Transaction, BudgetLimits } from '../types';
import { Calculator, ShieldCheck, TrendingUp, AlertTriangle, Edit3, Save, X, Plus, Trash2 } from 'lucide-react';

interface Props {
  transactions: Transaction[]; // These are now FILTERED transactions passed from App
  budgetLimits: BudgetLimits;
  onUpdateLimits: (newLimits: BudgetLimits) => Promise<void>;
  formatCurrency: (val: number) => string;
  labels: any;
}

export const BudgetView: React.FC<Props> = ({ transactions, budgetLimits, onUpdateLimits, formatCurrency, labels }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLimits, setEditedLimits] = useState<BudgetLimits>(budgetLimits);
  const [saving, setSaving] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Sync edited limits when props change
  useEffect(() => {
    if (!isEditing) {
        setEditedLimits(budgetLimits);
    }
  }, [budgetLimits, isEditing]);

  // Helper: Get days in current month (used for Daily Target calculation logic only)
  const getDaysInMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth();

  // Stats Calculation based on the PASSED transactions (which are already filtered by Date Range in App.tsx)
  const stats = useMemo(() => {
    const spentByCategory: Record<string, number> = {};
    let totalSpent = 0;

    // Filter only expenses from the provided range
    const expenseTx = transactions.filter(t => t.type === 'expense');

    expenseTx.forEach(t => {
      spentByCategory[t.category] = (spentByCategory[t.category] || 0) + t.amount;
      totalSpent += t.amount;
    });

    return { spentByCategory, totalSpent };
  }, [transactions]);

  // Forecast Calculations
  const forecast = useMemo(() => {
    const totalBudget = Object.values(budgetLimits).reduce((a, b) => a + b, 0);
    const totalSpent = stats.totalSpent;
    const remainingBudget = totalBudget - totalSpent;

    const percentUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return {
      totalBudget,
      remainingBudget,
      status: percentUsed > 100 ? 'danger' : percentUsed > 85 ? 'warning' : 'good',
      percentUsed
    };
  }, [budgetLimits, stats]);

  const handleSave = async () => {
    setSaving(true);
    await onUpdateLimits(editedLimits);
    setSaving(false);
    setIsEditing(false);
  };

  const handleLimitChange = (category: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setEditedLimits(prev => ({
      ...prev,
      [category]: numValue
    }));
  };

  const handleDailyTargetChange = (category: string, value: string) => {
    const dailyVal = parseFloat(value) || 0;
    const monthlyVal = Math.round(dailyVal * daysInMonth);
    setEditedLimits(prev => ({
        ...prev,
        [category]: monthlyVal
    }));
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const name = newCategoryName.trim();
    setEditedLimits(prev => ({
        ...prev,
        [name]: 0
    }));
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  const handleDeleteCategory = (cat: string) => {
      setEditedLimits(prev => {
          const next = { ...prev };
          delete next[cat];
          return next;
      });
  };

  const categories = useMemo(() => Object.keys(editedLimits).sort(), [editedLimits]);

  return (
    <div className="space-y-6">
      {/* Smart Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Limit Card */}
        <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-emerald-500/20">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-500 animate-in zoom-in duration-500">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Total Budget Limit</p>
              <h3 className="text-2xl font-bold text-white">{formatCurrency(forecast.totalBudget)}</h3>
              <p className="text-xs text-zinc-600">for all categories</p>
            </div>
          </CardContent>
        </Card>

        {/* Remaining Budget Card */}
        <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-orange-500/20">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-full text-orange-500 animate-in zoom-in duration-500 delay-75">
              <Calculator size={24} />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Remaining Budget</p>
              <h3 className="text-2xl font-bold text-white">{formatCurrency(forecast.remainingBudget)}</h3>
              <p className="text-xs text-zinc-600">{formatCurrency(stats.totalSpent)} spent in this period</p>
            </div>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card className={`bg-gradient-to-br from-zinc-900 to-zinc-950 ${forecast.status === 'danger' ? 'border-red-500/20' : 'border-blue-500/20'}`}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className={`p-3 rounded-full animate-in zoom-in duration-500 delay-150 ${forecast.status === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
              {forecast.status === 'danger' ? <AlertTriangle size={24} /> : <TrendingUp size={24} />}
            </div>
            <div>
              <p className="text-sm text-zinc-500">{labels.budgetStatus}</p>
              <h3 className={`text-2xl font-bold ${forecast.status === 'danger' ? 'text-red-500' : 'text-blue-500'}`}>
                {forecast.status === 'danger' ? labels.overBudget : labels.onTrack}
              </h3>
              <p className="text-xs text-zinc-600">
                {forecast.percentUsed.toFixed(1)}% utilized
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Budget List */}
      <Card className="border-t-4 border-t-orange-500">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
             <CardTitle>{labels.smartBudgeting}</CardTitle>
             <p className="text-zinc-400 text-sm mt-1">{labels.budgetDesc}</p>
          </div>
          <div>
            {isEditing ? (
              <div className="flex gap-2">
                 <Button variant="secondary" size="sm" onClick={() => { setIsEditing(false); setEditedLimits(budgetLimits); }}>
                   <X size={16} className="mr-2" /> {labels.cancel}
                 </Button>
                 <Button size="sm" onClick={handleSave} disabled={saving}>
                   {saving ? <span className="animate-spin mr-2">C</span> : <Save size={16} className="mr-2" />}
                   {labels.saveBudget}
                 </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 size={16} className="mr-2" /> {labels.manageBudget}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, index) => {
              const spent = stats.spentByCategory[cat] || 0;
              const limit = editedLimits[cat] || 0;
              const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : spent > 0 ? 100 : 0;
              
              let color = "bg-emerald-500";
              if (percent > 85) color = "bg-red-500";
              else if (percent > 60) color = "bg-yellow-500";

              if (isEditing) {
                  return (
                    <div 
                        key={cat} 
                        className="rounded-xl p-4 border border-orange-500/50 bg-orange-500/5 relative group animate-in zoom-in-95 fade-in duration-300 fill-mode-backwards"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="flex justify-between items-center mb-2">
                             <span className="font-medium text-white truncate pr-2" title={cat}>{cat}</span>
                             <button 
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDeleteCategory(cat);
                                }}
                                className="z-10 bg-zinc-800 text-zinc-400 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-all active:scale-95 shadow-sm hover:shadow-red-500/20"
                                title="Delete Category"
                             >
                                 <Trash2 size={16} className="pointer-events-none" />
                             </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                             <div>
                                 <label className="text-[10px] uppercase text-zinc-500">{labels.monthlyLimit}</label>
                                 <Input 
                                    type="number" 
                                    className="h-8 text-right bg-zinc-950 border-orange-500/30 focus:border-orange-500" 
                                    value={limit} 
                                    onChange={(e) => handleLimitChange(cat, e.target.value)}
                                  />
                             </div>
                             <div>
                                 <label className="text-[10px] uppercase text-zinc-500">{labels.dailyTarget}</label>
                                 <Input 
                                    type="number" 
                                    className="h-8 text-right bg-zinc-950 border-zinc-700 focus:border-orange-500" 
                                    value={(limit / daysInMonth).toFixed(0)} 
                                    onChange={(e) => handleDailyTargetChange(cat, e.target.value)}
                                  />
                             </div>
                        </div>
                    </div>
                  );
              }

              return (
                <div 
                    key={cat} 
                    className="rounded-xl p-4 border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards"
                    style={{ animationDelay: `${index * 75}ms` }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-white truncate pr-2">{cat}</span>
                    <span className="text-xs text-zinc-500 whitespace-nowrap">{labels.monthlyLimit}: {formatCurrency(limit)}</span>
                  </div>

                  <div className="mb-2 flex justify-between text-sm">
                    <span className={`font-semibold ${spent > limit ? 'text-red-400' : 'text-zinc-300'}`}>
                        {formatCurrency(spent)}
                    </span>
                    <span className={`${percent > 90 ? 'text-red-500' : 'text-zinc-500'}`}>{percent.toFixed(0)}%</span>
                  </div>
                  
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`} 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}

            {isEditing && (
                <div className="rounded-xl p-4 border border-dashed border-zinc-700 bg-zinc-900/30 flex items-center justify-center min-h-[140px] animate-in zoom-in-95 duration-200 delay-75">
                    {!isAddingCategory ? (
                        <button 
                            type="button"
                            onClick={() => setIsAddingCategory(true)}
                            className="flex flex-col items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors group"
                        >
                            <div className="p-2 rounded-full bg-zinc-800 group-hover:bg-orange-500/10 transition-colors">
                                <Plus size={24} />
                            </div>
                            <span className="text-sm font-medium">{labels.addCategory}</span>
                        </button>
                    ) : (
                        <div className="w-full space-y-3">
                            <Input 
                                placeholder={labels.newCategoryName}
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddCategory();
                                }}
                            />
                            <div className="flex gap-2">
                                <Button size="sm" onClick={handleAddCategory} className="flex-1">{labels.addCategory}</Button>
                                <Button size="sm" variant="secondary" onClick={() => setIsAddingCategory(false)}><X size={16}/></Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};