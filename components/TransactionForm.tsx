import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select } from './ui/DesignSystem';
import { Transaction, TransactionType, CurrencyCode } from '../types';
import { Plus } from 'lucide-react';

interface Props {
  onAdd: (t: Omit<Transaction, 'id' | 'created_at'>) => Promise<void>;
  loading: boolean;
  labels: any;
  categories: string[];
  currency: CurrencyCode;
}

export const TransactionForm: React.FC<Props> = ({ onAdd, loading, labels, categories, currency }) => {
  // Helper to get Local Date string (YYYY-MM-DD) correctly based on user's timezone
  const getLocalDate = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - offset).toISOString().slice(0, 10);
    return localISOTime;
  };

  // rawAmount holds the actual numeric value for calculations
  const [rawAmount, setRawAmount] = useState<string>('');
  // displayAmount holds the formatted string (e.g. "Rp 50.000")
  const [displayAmount, setDisplayAmount] = useState<string>('');
  
  const [description, setDescription] = useState('');
  // Fallback to 'Other' if categories are empty to prevent undefined state
  const [category, setCategory] = useState(categories[0] || 'Other');
  const [type, setType] = useState<TransactionType>('expense');
  const [date, setDate] = useState(getLocalDate());

  // Safety Check: If categories update (e.g. user deleted the selected one), reset to valid option
  useEffect(() => {
    if (categories.length > 0) {
       if (!categories.includes(category)) {
           setCategory(categories[0]);
       }
    } else {
        setCategory('Other');
    }
  }, [categories, category]);

  // Handle input changes for amount with auto-formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Remove non-numeric chars
    const value = e.target.value.replace(/[^0-9]/g, '');
    
    setRawAmount(value);
    
    if (!value) {
      setDisplayAmount('');
      return;
    }

    // 2. Format based on currency
    const num = parseInt(value, 10);
    let formatted = '';
    
    if (currency === 'IDR') {
      // Indonesian Format: Rp 10.000
      formatted = `Rp ${num.toLocaleString('id-ID')}`;
    } else if (currency === 'EUR') {
      // European: € 10.000
      formatted = `€ ${num.toLocaleString('de-DE')}`;
    } else {
      // US/Default: $ 10,000
      formatted = `$ ${num.toLocaleString('en-US')}`;
    }

    setDisplayAmount(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(rawAmount);
    
    if (!numericAmount || !description) return;

    await onAdd({
      amount: numericAmount,
      description,
      category,
      type,
      date,
    });

    // Reset form
    setRawAmount('');
    setDisplayAmount('');
    setDescription('');
    // Keep the type and date as is for easier multiple entry
    if (categories.length > 0) setCategory(categories[0]);
  };

  return (
    <Card className="h-full" id="tour-quick-add">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <div className="p-1 bg-orange-500 rounded-md">
                <Plus className="w-4 h-4 text-white" />
            </div>
            {labels.quickAdd}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-2 p-1 bg-zinc-950 rounded-lg border border-zinc-800">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                type === 'expense' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                type === 'income' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Income
            </button>
          </div>

          {/* Custom Amount Input with Auto-Formatting */}
          <Input 
            label="Amount" 
            type="text" // Must be text to allow symbols
            inputMode="numeric" // Triggers numeric keyboard on mobile
            placeholder={currency === 'IDR' ? "Rp 0" : "0.00"}
            value={displayAmount} 
            onChange={handleAmountChange}
            required 
          />
          
          <Input 
            label="Description" 
            placeholder="e.g. Weekly Groceries" 
            value={description} 
            onChange={e => setDescription(e.target.value)}
            required 
          />

          <Select 
            label="Category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            options={categories.length > 0 
              ? categories.map(c => ({ value: c, label: c }))
              : [{ value: 'Other', label: 'Other' }]
            }
          />

          <Input 
            label="Date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />

          <Button type="submit" disabled={loading || !rawAmount} className="mt-2 w-full">
            {loading ? labels.adding : labels.addTransaction}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};