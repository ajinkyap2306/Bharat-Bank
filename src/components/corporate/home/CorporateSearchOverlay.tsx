import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronLeft, Building2, ArrowUpRight, FileText, Users } from 'lucide-react';

interface SearchResult {
  id: string;
  category: 'Transactions' | 'Beneficiaries' | 'Payments' | 'Accounts' | 'Reports' | 'Services';
  title: string;
  subtitle?: string;
}

const SEARCH_INDEX: SearchResult[] = [
  { id: 's1', category: 'Transactions', title: 'ABC Suppliers Ltd.', subtitle: '₹2,50,000 • Payment' },
  { id: 's2', category: 'Beneficiaries', title: 'ABC Suppliers Ltd.', subtitle: 'Vendor • Active' },
  { id: 's3', category: 'Payments', title: '₹2,50,000', subtitle: 'ABC Suppliers Ltd.' },
  { id: 's4', category: 'Accounts', title: 'Operating Account', subtitle: 'XXXX 4582' },
  { id: 's5', category: 'Reports', title: 'Cash Flow Statement', subtitle: 'Aug 2026' },
  { id: 's6', category: 'Services', title: 'Bulk Payroll', subtitle: 'Corporate Services' },
  { id: 's7', category: 'Transactions', title: 'Salary Batch', subtitle: '₹8,45,000 • Payroll' },
  { id: 's8', category: 'Beneficiaries', title: 'CtrlS Datacenters Ltd', subtitle: 'Vendor' },
];

const categoryIcon = (cat: SearchResult['category']) => {
  switch (cat) {
    case 'Accounts': return Building2;
    case 'Beneficiaries': return Users;
    case 'Payments': return ArrowUpRight;
    default: return FileText;
  }
};

interface CorporateSearchOverlayProps {
  onClose: () => void;
  onNavigate?: (category: string) => void;
}

export const CorporateSearchOverlay: React.FC<CorporateSearchOverlayProps> = ({ onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SEARCH_INDEX.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.subtitle?.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>();
    results.forEach((r) => {
      const list = map.get(r.category) || [];
      list.push(r);
      map.set(r.category, list);
    });
    return map;
  }, [results]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="fixed inset-0 z-50 bg-[#F7F9FC] dark:bg-slate-950 flex flex-col"
    >
      <div className="px-3 pt-3 pb-2 safe-top border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search accounts, transactions, beneficiaries..."
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-[#111827] dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {query.trim() === '' ? (
          <p className="text-sm text-[#667085] text-center py-12">
            Search accounts, transactions, beneficiaries, payments, reports, and services
          </p>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-base font-bold text-[#111827] dark:text-white">No results found</p>
            <p className="text-sm text-[#667085] mt-2">Try another keyword.</p>
          </div>
        ) : (
          Array.from(grouped.entries()).map(([category, items]) => (
            <div key={category} className="mb-4">
              <p className="text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-2 px-1">{category}</p>
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((item) => {
                  const Icon = categoryIcon(item.category);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onNavigate?.(item.category)}
                      className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <div className="w-9 h-9 rounded-xl bg-congress-blue-50 dark:bg-congress-blue-950/60 text-congress-blue-700 dark:text-congress-blue-400 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-[#111827] dark:text-white truncate">{item.title}</p>
                        {item.subtitle && (
                          <p className="text-xs text-[#667085] truncate">{item.subtitle}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};
