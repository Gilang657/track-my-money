import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from './ui/DesignSystem';
import { Transaction } from '../types';
import { ArrowUpCircle, ArrowDownCircle, Trash2, Download, Calendar } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  formatCurrency: (val: number) => string;
  labels: any;
}

export const TransactionList: React.FC<Props> = ({ transactions, onDelete, formatCurrency, labels }) => {

  const handleExportCSV = () => {
    if (transactions.length === 0) return;

    // 1. Define Headers
    const headers = ['Date', 'Category', 'Description', 'Amount'];

    // 2. Convert Data to CSV Rows
    const rows = transactions.map(t => {
      // Escape quotes in strings
      const category = `"${t.category.replace(/"/g, '""')}"`;
      const description = `"${t.description.replace(/"/g, '""')}"`;
      
      // Make expenses negative for calculation utility in Excel/Sheets
      const amount = t.type === 'expense' ? -t.amount : t.amount;

      return [t.date, category, description, amount];
    });

    // 3. Join all with newlines
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // 4. Create Blob and Link (Add BOM \uFEFF for Excel UTF-8 compatibility)
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Grouping Logic ---
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    
    transactions.forEach(t => {
      if (!groups[t.date]) {
        groups[t.date] = [];
      }
      groups[t.date].push(t);
    });

    // Sort keys (dates) descending
    const sortedDates = Object.keys(groups).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );

    return sortedDates.map(date => {
      const txs = groups[date];
      const dailyExpense = txs
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        date,
        transactions: txs,
        dailyExpense
      };
    });
  }, [transactions]);

  const getRelativeDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const datePart = d.toLocaleDateString('en-US', options);

    if (d.toDateString() === today.toDateString()) return `Today, ${datePart}`;
    if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${datePart}`;
    return datePart;
  };

  let globalRowIndex = 0; // Used for staggered animation calculation

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between shrink-0">
        <CardTitle>{labels.recentTransactions}</CardTitle>
        <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={transactions.length === 0}>
          <Download className="w-4 h-4 mr-2" />
          CSV
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden flex flex-col">
        <div className="overflow-y-auto pr-2 -mr-2 flex-1 scroll-smooth">
          <table className="w-full text-left text-sm text-zinc-400 border-collapse">
            <thead className="text-xs uppercase bg-zinc-900/95 text-zinc-500 sticky top-0 z-20 backdrop-blur-md shadow-sm">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Type</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 rounded-r-lg text-center w-16">Action</th>
              </tr>
            </thead>
            
            {groupedTransactions.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-zinc-600">
                    <div className="flex flex-col items-center gap-2 animate-in fade-in duration-700">
                      <div className="p-4 rounded-full bg-zinc-900/50">
                        <Calendar className="w-8 h-8 text-zinc-700" />
                      </div>
                      <p>{labels.noTx}</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              groupedTransactions.map((group) => {
                const currentGroupStart = globalRowIndex;
                globalRowIndex += group.transactions.length;
                
                return (
                  <tbody key={group.date} className="before:block before:h-4 before:content-[''] first:before:h-0">
                    {/* Date Header Row */}
                    <tr className="bg-zinc-900/50 border-y border-zinc-800/50">
                      <td colSpan={5} className="px-4 py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-orange-500" />
                            {getRelativeDateLabel(group.date)}
                          </span>
                          {group.dailyExpense > 0 && (
                            <span className="text-xs font-medium text-zinc-500">
                              Spent: <span className="text-zinc-300">{formatCurrency(group.dailyExpense)}</span>
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Transaction Rows with Staggered Animation */}
                    {group.transactions.map((t, index) => (
                      <tr 
                        key={t.id} 
                        className="hover:bg-zinc-900/30 transition-colors group border-b border-zinc-800/30 last:border-0 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-backwards"
                        style={{ animationDelay: `${(currentGroupStart + index) * 50}ms` }}
                      >
                        <td className="px-4 py-3">
                          {t.type === 'income' ? (
                            <div className="flex items-center gap-2 text-emerald-500 font-medium">
                              <ArrowUpCircle className="w-4 h-4 shrink-0" />
                              <span className="hidden sm:inline text-xs">In</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-rose-500 font-medium">
                              <ArrowDownCircle className="w-4 h-4 shrink-0" />
                              <span className="hidden sm:inline text-xs">Out</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-white truncate max-w-[150px] sm:max-w-[200px]">
                          {t.description}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {t.category}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-right font-bold whitespace-nowrap ${t.type === 'income' ? 'text-emerald-500' : 'text-white'}`}>
                          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button 
                            onClick={() => onDelete(t.id)}
                            className="p-1.5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Delete Transaction"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                );
              })
            )}
          </table>
        </div>
      </CardContent>
    </Card>
  );
};